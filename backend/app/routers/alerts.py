from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from datetime import datetime
from typing import List

from app.database import get_session
from app.models import Alert
from app.schemas import AlertCreate
from app.deps import get_current_user

router = APIRouter(prefix="/alerts")


@router.get("/", response_model=List[dict])
def get_alerts(session: Session = Depends(get_session)):
    alerts = session.exec(select(Alert).where(Alert.is_active == True)).all()
    return [
        {
            "id": alert.id,
            "alert_type": alert.type,
            "message": alert.message,
            "location": alert.location,
            "station_id": alert.station_id,
            "reading_id": alert.reading_id,
            "issued_at": alert.issued_at,
            "is_active": alert.is_active
        }
        for alert in alerts
    ]


@router.post("/", response_model=dict)
def create_alert(alert_create: AlertCreate, session: Session = Depends(get_session)):
    alert = Alert(
        type=alert_create.type,
        message=alert_create.message,
        location=alert_create.location,
        station_id=alert_create.station_id,
        reading_id=alert_create.reading_id
    )
    session.add(alert)
    session.commit()
    session.refresh(alert)
    
    return {
        "id": alert.id,
        "alert_type": alert.type,
        "message": alert.message,
        "location": alert.location,
        "station_id": alert.station_id,
        "reading_id": alert.reading_id,
        "issued_at": alert.issued_at,
        "is_active": alert.is_active
    }


@router.put("/{alert_id}/deactivate")
def deactivate_alert(alert_id: int, session: Session = Depends(get_session)):
    alert = session.get(Alert, alert_id)
    if not alert:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_active = False
    session.commit()
    
    return {"message": "Alert deactivated successfully"}