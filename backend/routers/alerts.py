from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.core.deps import get_db, get_current_user, require_roles
from backend.models.enums import UserRole
from backend.models.alert import Alert
from backend.schemas.alert import AlertCreate, AlertOut

router = APIRouter()

@router.post("/", response_model=AlertOut)
def create_alert(
    payload: AlertCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles(UserRole.admin, UserRole.authority)),
):
    alert = Alert(**payload.model_dump())
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

@router.get("/", response_model=List[AlertOut])
def list_alerts(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Alert).order_by(Alert.issued_at.desc()).all()
