from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas
from auth import get_current_user, require_authority_or_admin, require_ngo_or_admin
from utils.image_upload import save_upload_file, delete_file
from datetime import datetime

router = APIRouter(tags=["Reports"])
report_router = APIRouter(tags=["Report"])


@router.get("/", response_model=List[schemas.ReportResponse])
def get_reports(
    status: Optional[str] = None,
    station_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Report)
    
    # Apply filters
    if status:
        query = query.filter(models.Report.status == status)
    if station_id:
        query = query.filter(models.Report.station_id == station_id)
    
    # If not admin, only show own reports
    if current_user.role != models.UserRole.ADMIN:
        query = query.filter(models.Report.user_id == current_user.id)
    
    return query.order_by(models.Report.created_at.desc()).all()


# Single report endpoint for API compatibility
@report_router.post("/", response_model=schemas.ReportResponse)
def create_single_report(
    report: schemas.ReportCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_report = models.Report(
        user_id=current_user.id,
        **report.dict()
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report


@router.put("/{report_id}", response_model=schemas.ReportResponse)
def update_report_status(
    report_id: int,
    status_update: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Update report status - only authority/admin can verify/reject"""
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Check permissions - only authority/admin can update status
    if current_user.role not in [models.UserRole.AUTHORITY, models.UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only authority or admin can update report status"
        )
    
    new_status = status_update.get("status")
    if new_status:
        # Validate status
        valid_statuses = ["pending", "verified", "rejected"]
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: {valid_statuses}"
            )
        
        # Convert string to enum
        try:
            report.status = models.ReportStatus[new_status.upper()]
        except KeyError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {new_status}"
            )
        
        if new_status in ["verified", "rejected"]:
            report.verified_by = current_user.id
    
    db.commit()
    db.refresh(report)
    return report
