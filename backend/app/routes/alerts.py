from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db
from app.models import Alert
from app.schemas import AlertCreate, AlertResponse
from app.auth import require_admin

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.post("/", response_model=AlertResponse)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    new_alert = Alert(**alert.model_dump())
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert


@router.get("/", response_model=List[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(Alert.issued_at.desc()).all()



