from fastapi import APIRouter
from sqlmodel import Session, select
from sqlalchemy import func
from aiocache import cached, Cache
from typing import Dict, Any

from app.database import get_session
from app.models import WaterStation, StationReading, Report, Alert

router = APIRouter(prefix="/dashboard")

# Use in-memory cache backend
# (aiocache accepts Cache.MEMORY as the in-memory backend)

@router.get("/data", response_model=Dict[str, Any])
@cached(ttl=300, cache=Cache.MEMORY)  # Cache for 5 minutes
async def get_dashboard_data():
    """
    Get dashboard data with caching
    Response: { tws: n, trc: r, arps: n, areps: .., asc: {s:c, ..}, rsc, ... }
    """
    # Get session manually since we're using caching decorator
    from app.database import engine
    with Session(engine) as session:
        def _get_count(model):
            res = session.exec(select(func.count()).select_from(model)).one()
            return res[0] if isinstance(res, (tuple, list)) else res

        # Total Waterstations
        total_waterstations = _get_count(WaterStation)
        
        # Total Readings Collected
        total_readings_collected = _get_count(StationReading)
        
        # Avg readings per station
        avg_readings_per_station = 0
        if total_waterstations > 0:
            avg_readings_per_station = round(total_readings_collected / total_waterstations, 2)
        
        # Avg reports per station
        total_reports = _get_count(Report)
        avg_reports_per_station = 0
        if total_waterstations > 0:
            avg_reports_per_station = round(total_reports / total_waterstations, 2)
        
        # Alert status count
        all_alerts = session.exec(select(Alert)).all()
        alert_status_count = {}
        for alert in all_alerts:
            status = alert.type
            alert_status_count[status] = alert_status_count.get(status, 0) + 1
        
        # Report status count
        all_reports = session.exec(select(Report)).all()
        report_status_count = {}
        for report in all_reports:
            status = report.status
            report_status_count[status] = report_status_count.get(status, 0) + 1
        
        # Get latest alerts (last 3)
        latest_alerts = session.exec(
            select(Alert)
            .order_by(Alert.issued_at.desc())
            .limit(3)
        ).all()
        
        formatted_latest_alerts = [
            {
                "id": alert.id,
                "type": alert.type,
                "message": alert.message,
                "location": alert.location,
                "issued_at": alert.issued_at
            }
            for alert in latest_alerts
        ]
        
        # Get latest reports (last 3)
        latest_reports = session.exec(
            select(Report)
            .order_by(Report.created_at.desc())
            .limit(3)
        ).all()
        
        formatted_latest_reports = [
            {
                "id": report.id,
                "location": report.location,
                "description": report.description,
                "water_source": report.water_source,
                "status": report.status,
                "created_at": report.created_at
            }
            for report in latest_reports
        ]
        
        return {
            "tws": total_waterstations,
            "trc": total_readings_collected,
            "arps": avg_readings_per_station,
            "areps": avg_reports_per_station,
            "asc": alert_status_count,
            "rsc": report_status_count,
            "latest_alerts": formatted_latest_alerts,
            "latest_reports": formatted_latest_reports
        }