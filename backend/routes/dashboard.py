from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
from auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/")
def get_dashboard_data(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    total_stations = db.query(models.WaterStation).count()
    total_reports = db.query(models.Report).count()
    total_readings = db.query(models.StationReading).count()
    total_alerts = db.query(models.Alert).count()

    pending = db.query(models.Report).filter(
        models.Report.status == "pending"
    ).count()

    verified = db.query(models.Report).filter(
        models.Report.status == "verified"
    ).count()

    rejected = db.query(models.Report).filter(
        models.Report.status == "rejected"
    ).count()

    latest_alerts = db.query(models.Alert)\
        .order_by(models.Alert.created_at.desc())\
        .limit(3)\
        .all()

    latest_reports = db.query(models.Report)\
        .order_by(models.Report.created_at.desc())\
        .limit(3)\
        .all()

    return {
        "total_stations": total_stations,
        "total_reports": total_reports,
        "total_readings": total_readings,
        "total_alerts": total_alerts,
        "report_status": {
            "pending": pending,
            "verified": verified,
            "rejected": rejected
        },
        "latest_alerts": latest_alerts,
        "latest_reports": latest_reports
    }
