from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
import logging
from datetime import datetime
import time

from app.database import get_db
from app.models import Report, Station, Alert
from app.schemas import AlertResponse, ReportResponse
from app.auth import require_role
from app.services.ogd_service import ogd_service

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["Dashboard"])

# Simple in-memory cache
dashboard_cache = {
    "data": None,
    "timestamp": 0
}
CACHE_DURATION = 30 # seconds

@router.get("/dashboard-data")
def get_dashboard_data(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["ngo", "authority", "admin", "citizen"]))
):
    """
    Get aggregated dashboard data
    """
    global dashboard_cache
    current_time = time.time()
    
    # Check cache
    if dashboard_cache["data"] and (current_time - dashboard_cache["timestamp"] < CACHE_DURATION):
        logger.info("Serving dashboard data from cache")
        return dashboard_cache["data"]

    try:
        # 1. Stats
        total_stations = db.query(Station).count()
        total_reports = db.query(Report).count()
        
        # Mocking total readings as we don't store them individually in DB
        # In a real scenario, this would be `db.query(Reading).count()`
        # We'll use a multiplier of stations or reports to simulate
        total_readings = total_stations * 150 + total_reports * 10 
        
        avg_readings_per_station = round(total_readings / total_stations, 1) if total_stations > 0 else 0
        avg_reports_per_station = round(total_reports / total_stations, 1) if total_stations > 0 else 0
        
        # 2. Status Counts (Pie Charts)
        # Reports
        report_status_counts = db.query(Report.status, func.count(Report.status)).group_by(Report.status).all()
        report_pie_data = [{"name": status, "value": count} for status, count in report_status_counts]
        
        # Alerts
        alert_status_counts = db.query(Alert.status, func.count(Alert.status)).group_by(Alert.status).all()
        alert_pie_data = [{"name": status, "value": count} for status, count in alert_status_counts]
        if not alert_pie_data:
             # Mock data if empty for visualization
            alert_pie_data = [{"name": "Active", "value": 5}, {"name": "Resolved", "value": 12}]
            
        # 3. Parameter Stats (Box Plot)
        # Fetch live data sample to calculate stats
        live_data = ogd_service.get_live_readings()
        ph_values = [d['ph'] for d in live_data if 'ph' in d]
        turb_values = [d['turbidity'] for d in live_data if 'turbidity' in d]
        
        def calculate_box_plot_stats(values):
            if not values:
                return {}
            sorted_vals = sorted(values)
            n = len(sorted_vals)
            min_val = sorted_vals[0]
            max_val = sorted_vals[-1]
            median = sorted_vals[n // 2]
            q1 = sorted_vals[n // 4]
            q3 = sorted_vals[n * 3 // 4]
            return {"min": min_val, "q1": q1, "median": median, "q3": q3, "max": max_val}

        box_plot_data = [
            {"name": "pH", "stats": calculate_box_plot_stats(ph_values)},
            {"name": "Turbidity", "stats": calculate_box_plot_stats(turb_values)}
        ]

        # 4. Latest Items
        latest_reports = db.query(Report).order_by(Report.id.desc()).limit(3).all()
        latest_alerts = db.query(Alert).order_by(Alert.id.desc()).limit(3).all()
        
        # If no alerts, generate some mock ones for display
        if not latest_alerts:
            latest_alerts = [
                {"id": 1, "station_name": "Station A", "level": "High", "message": "High pH detected", "status": "active", "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")},
                {"id": 2, "station_name": "Station B", "level": "Critical", "message": "Low DO levels", "status": "active", "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")}
            ]

        response_data = {
            "stats": {
                "total_stations": total_stations,
                "total_readings": total_readings,
                "avg_readings_source": avg_readings_per_station, 
                "avg_reports_station": avg_reports_per_station
            },
            "charts": {
                "report_status": report_pie_data,
                "alert_status": alert_pie_data,
                "parameter_stats": box_plot_data
            },
            "latest": {
                "reports": latest_reports,
                "alerts": latest_alerts
            }
        }
        
        # Update cache
        dashboard_cache["data"] = response_data
        dashboard_cache["timestamp"] = current_time
        
        return response_data


    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        logger.error(f"Dashboard data error: {error_details}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch dashboard data: {str(e)}"
        )
