from typing import List
from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from sqlalchemy.orm import Session
from backend.core.deps import get_db, get_current_user, require_roles
from backend.models.enums import UserRole
from backend.models.report import Report
from backend.schemas.report import ReportOut, ReportStatusUpdate
from backend.services.files import save_upload_file

router = APIRouter()

@router.post("/", response_model=ReportOut)
def create_report(
    location: str = Form(...),
    description: str = Form(...),
    water_source: str = Form(...),
    photo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    photo_url = None
    if photo:
        filename = save_upload_file(photo)
        photo_url = f"/uploads/{filename}"

    report = Report(
        user_id=current_user.id,
        photo_url=photo_url,
        location=location,
        description=description,
        water_source=water_source,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("/", response_model=List[ReportOut])
def list_reports(
    db: Session = Depends(get_db),
    current_user = Depends(require_roles(UserRole.admin, UserRole.authority, UserRole.ngo)),
):
    return db.query(Report).order_by(Report.created_at.desc()).all()

@router.get("/me", response_model=List[ReportOut])
def list_my_reports(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.created_at.desc())
        .all()
    )

@router.put("/{report_id}/status", response_model=ReportOut)
def update_report_status(
    report_id: int,
    payload: ReportStatusUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles(UserRole.admin, UserRole.authority)),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = payload.status
    db.commit()
    db.refresh(report)
    return report
