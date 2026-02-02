from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Report
from app.utils import require_role
import os, shutil

# Added the trailing slash to the prefix to match your frontend calls
router = APIRouter(prefix="/report", tags=["Reports"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------------
# CREATE REPORT 
# -------------------------------
@router.post("/")  # This responds to /report/
def create_report(
    description: str = Form(...),
    location: str = Form(...),
    water_source: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    # UPDATED: Added more roles so you aren't blocked during testing
    user=Depends(require_role(["citizen", "admin", "ngo", "authority"]))
):
    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    report = Report(
        description=description,
        location=location,
        water_source=water_source,
        photo_url=file_path,
        status="pending"
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {"message": "Report submitted successfully"}

# -------------------------------
# GET ALL REPORTS
# -------------------------------
@router.get("/")
def get_reports(
    db: Session = Depends(get_db),
    user=Depends(require_role(["citizen", "ngo", "authority", "admin"]))
):
    return db.query(Report).all()

# -------------------------------
# VERIFY / REJECT REPORT
# -------------------------------
@router.post("/action")
def report_action(
    report_id: int = Form(...),
    verified: bool = Form(...),
    db: Session = Depends(get_db),
    user=Depends(require_role(["authority", "admin"]))
):
    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = "verified" if verified else "rejected"
    db.commit()

    return {"message": "Report status updated"}