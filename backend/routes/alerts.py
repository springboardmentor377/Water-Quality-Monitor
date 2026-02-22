from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas
from auth import get_current_user, require_authority_or_admin
from datetime import datetime

router = APIRouter(tags=["Alerts"])
alert_router = APIRouter(tags=["Alert"])


@router.get("/", response_model=List[schemas.AlertResponse])
def get_alerts(
    severity: Optional[str] = None,
    station_id: Optional[int] = None,
    active_only: bool = False,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Alert)
    
    # Apply filters
    if severity:
        query = query.filter(models.Alert.severity == severity)
    if station_id:
        query = query.filter(models.Alert.station_id == station_id)
    if active_only:
        query = query.filter(
            (models.Alert.expires_at.is_(None)) | 
            (models.Alert.expires_at > datetime.utcnow())
        )
    
    alerts = query.order_by(models.Alert.issued_at.desc()).all()
    
    # Add active and created_at fields to each alert
    result = []
    for alert in alerts:
        alert_dict = {
            "id": alert.id,
            "type": alert.type,
            "severity": alert.severity,
            "message": alert.message,
            "location": alert.location,
            "station_id": alert.station_id,
            "expires_at": alert.expires_at,
            "issued_at": alert.issued_at,
            "created_at": alert.issued_at,  # Map issued_at to created_at for frontend
            "active": alert.expires_at is None or alert.expires_at > datetime.utcnow()
        }
        result.append(schemas.AlertResponse(**alert_dict))
    
    return result


# Single alert endpoint for API compatibility
@alert_router.post("/", response_model=schemas.AlertResponse)
def create_single_alert(
    alert_data: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_authority_or_admin)
):
    # Handle flexible input - frontend may not send 'type'
    alert_dict = alert_data.copy()
    
    # Set default type if not provided
    if "type" not in alert_dict:
        alert_dict["type"] = models.AlertType.CONTAMINATION
    
    # Convert severity string to enum if needed
    if "severity" in alert_dict and isinstance(alert_dict["severity"], str):
        severity_str = alert_dict["severity"].lower()
        if severity_str == "critical":
            alert_dict["severity"] = models.AlertSeverity.CRITICAL
        elif severity_str == "high":
            alert_dict["severity"] = models.AlertSeverity.HIGH
        elif severity_str == "medium":
            alert_dict["severity"] = models.AlertSeverity.MEDIUM
        elif severity_str == "low":
            alert_dict["severity"] = models.AlertSeverity.LOW
    
    # Create alert using AlertCreate schema for validation
    alert_create = schemas.AlertCreate(**alert_dict)
    new_alert = models.Alert(**alert_create.dict())
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    
    # Return with active and created_at fields using AlertResponse schema
    alert_response_dict = {
        "id": new_alert.id,
        "type": new_alert.type,
        "severity": new_alert.severity,
        "message": new_alert.message,
        "location": new_alert.location,
        "station_id": new_alert.station_id,
        "expires_at": new_alert.expires_at,
        "issued_at": new_alert.issued_at,
        "created_at": new_alert.issued_at,  # Map issued_at to created_at for frontend
        "active": new_alert.expires_at is None or new_alert.expires_at > datetime.utcnow()
    }
    return schemas.AlertResponse(**alert_response_dict)
