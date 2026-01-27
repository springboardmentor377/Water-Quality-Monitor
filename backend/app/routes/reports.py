from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Report

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Create report
@router.post("/")
def create_report(data: dict, db: Session = Depends(get_db)):
    report = Report(**data)
    db.add(report)
    db.commit()
    db.refresh(report)
    return {"message": "Report submitted"}

# ✅ Get all reports
@router.get("/")
def get_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()

# ✅ Verify / Reject
@router.post("/action")
def report_action(data: dict, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == data["report_id"]).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = "verified" if data["verified"] else "rejected"
    db.commit()
    return {"message": "Updated"}
