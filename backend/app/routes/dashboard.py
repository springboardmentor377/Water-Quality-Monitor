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
    station_id: int = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["ngo", "authority", "admin", "citizen"]))
):
    """
    Get aggregated dashboard data
    """
    global dashboard_cache
    current_time = time.time()
    
    # Check cache (key now includes station_id)
    cache_key = f"data_{station_id}" if station_id else "data_all"
    
    # In a real app, you'd cache per station or invalidate smartly. For now, we skip cache if station_id is present to keep it simple/fresh
    if not station_id and dashboard_cache.get("data") and (current_time - dashboard_cache["timestamp"] < CACHE_DURATION):
        logger.info("Serving dashboard data from cache")
        return dashboard_cache["data"]

    try:
        query_filters = []
        station_name = None
        
        # If station_id is provided, get the name to filter other tables
        if station_id:
            station = db.query(Station).filter(Station.id == station_id).first()
            if station:
                station_name = station.name
        
        # --- FETCH REAL DATA FIRST ---
        # Fetch live data sample to calculate stats and charts
        live_data = ogd_service.get_live_readings()
        
        # Filter OGD data if station selected
        if station_name:
            # OGD 'station' field matches our station_name?
            live_data = [d for d in live_data if d.get('station') == station_name]

        # Calculate Real Averages for Charts
        def get_avg(data, key):
            vals = [d[key] for d in data if isinstance(d.get(key), (int, float))]
            return round(sum(vals) / len(vals), 2) if vals else 0

        avg_ph = get_avg(live_data, 'ph') or 7.0
        avg_turb = get_avg(live_data, 'turbidity') or 5.0
        avg_do = get_avg(live_data, 'do') or 6.0

        # 1. Stats
        if station_id:
             total_stations = 1
        else:
             total_stations = db.query(Station).count()

        rel_reports = db.query(Report)
        if station_name:
            rel_reports = rel_reports.filter(Report.station_name == station_name)
        total_reports = rel_reports.count()
        
        # REAL READINGS COUNT
        total_readings = len(live_data)
        
        avg_readings_per_station = round(total_readings / total_stations, 1) if total_stations > 0 else 0
        avg_reports_per_station = round(total_reports / total_stations, 1) if total_stations > 0 else 0
        
        # 2. Status Counts (Pie Charts)
        # Reports
        rel_reports_status = db.query(Report.status, func.count(Report.status))
        if station_name:
            rel_reports_status = rel_reports_status.filter(Report.station_name == station_name)
        report_status_counts = rel_reports_status.group_by(Report.status).all()
        
        report_pie_data = [{"name": status, "value": count} for status, count in report_status_counts]
        if not report_pie_data:
            report_pie_data = [{"name": "Verified", "value": 10}, {"name": "Pending", "value": 5}]
        
        # Alerts
        rel_alerts = db.query(Alert.status, func.count(Alert.status))
        if station_name:
            rel_alerts = rel_alerts.filter(Alert.station_name == station_name)
        alert_status_counts = rel_alerts.group_by(Alert.status).all()
        
        alert_pie_data = [{"name": status, "value": count} for status, count in alert_status_counts]
        if not alert_pie_data:
             # Mock data if empty for visualization
            alert_pie_data = [{"name": "Active", "value": 5}, {"name": "Resolved", "value": 12}]
            
        # 3. Parameter Stats (Box Plot)
        # Uses 'live_data' fetched above
        ph_values = [d['ph'] for d in live_data if 'ph' in d]
        turb_values = [d['turbidity'] for d in live_data if 'turbidity' in d]
        
        def calculate_box_plot_stats(values):
            if not values:
                # Return mocks if no live data for this specific station to avoid empty charts
                return {"min": 6.5, "q1": 7.0, "median": 7.2, "q3": 7.5, "max": 8.0}
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
        rel_latest_reports = db.query(Report)
        if station_name:
            rel_latest_reports = rel_latest_reports.filter(Report.station_name == station_name)
        latest_reports = rel_latest_reports.order_by(Report.id.desc()).limit(3).all()

        rel_latest_alerts = db.query(Alert)
        if station_name:
            rel_latest_alerts = rel_latest_alerts.filter(Alert.station_name == station_name)
        latest_alerts = rel_latest_alerts.order_by(Alert.id.desc()).limit(3).all()
        
        # If no alerts, generate some mock ones for display
        if not latest_alerts:
            prefix = f"[{station_name}] " if station_name else ""
            latest_alerts = [
                {"id": 1, "station_name": station_name or "Station A", "level": "High", "message": f"{prefix}High pH detected", "status": "active", "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")},
                {"id": 2, "station_name": station_name or "Station B", "level": "Critical", "message": f"{prefix}Low DO levels", "status": "active", "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")}
            ]

        # 5. Line Chart Data (Trend anchored to REAL current values)
        # We generate a synthetic 24h history that ends at 'avg_ph' / 'avg_turb'
        import random
        line_chart_data = [
            {"time": "00:00", "pH": round(avg_ph + random.uniform(-0.5, 0.5), 1), "Turbidity": round(avg_turb + random.uniform(-1, 1), 1), "DO": round(avg_do + random.uniform(-0.5, 0.5), 1)},
            {"time": "04:00", "pH": round(avg_ph + random.uniform(-0.4, 0.4), 1), "Turbidity": round(avg_turb + random.uniform(-0.8, 0.8), 1), "DO": round(avg_do + random.uniform(-0.4, 0.4), 1)},
            {"time": "08:00", "pH": round(avg_ph + random.uniform(-0.3, 0.3), 1), "Turbidity": round(avg_turb + random.uniform(-0.6, 0.6), 1), "DO": round(avg_do + random.uniform(-0.3, 0.3), 1)},
            {"time": "12:00", "pH": round(avg_ph + random.uniform(-0.2, 0.2), 1), "Turbidity": round(avg_turb + random.uniform(-0.4, 0.4), 1), "DO": round(avg_do + random.uniform(-0.2, 0.2), 1)},
            {"time": "16:00", "pH": round(avg_ph + random.uniform(-0.1, 0.1), 1), "Turbidity": round(avg_turb + random.uniform(-0.2, 0.2), 1), "DO": round(avg_do + random.uniform(-0.1, 0.1), 1)},
            {"time": "20:00", "pH": round(avg_ph + random.uniform(-0.3, 0.3), 1), "Turbidity": round(avg_turb + random.uniform(-0.5, 0.5), 1), "DO": round(avg_do + random.uniform(-0.3, 0.3), 1)},
            {"time": "Now",   "pH": avg_ph, "Turbidity": avg_turb, "DO": avg_do},
        ]

        # 6. Radar Chart Data (Real Averages vs Safe Limits)
        radar_chart_data = [
            {"subject": "pH", "A": avg_ph, "B": 8.5, "fullMark": 14}, # B is Limit
            {"subject": "DO", "A": avg_do, "B": 5.0, "fullMark": 10}, # B is Min Limit
            {"subject": "Turbidity", "A": avg_turb, "B": 5.0, "fullMark": 10},
            {"subject": "Temp", "A": 24, "B": 30, "fullMark": 50}, # Temp not in OGD, keeping mock
            {"subject": "Cond", "A": 400, "B": 1000, "fullMark": 2000}, # Cond not in OGD
            {"subject": "TDS", "A": 250, "B": 500, "fullMark": 1000}, # TDS not in OGD
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
                "parameter_stats": box_plot_data,
                "line_chart": line_chart_data,
                "radar_chart": radar_chart_data
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
