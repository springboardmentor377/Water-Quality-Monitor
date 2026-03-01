from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("/")
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db)):
    new_report = models.Report(**report.dict())
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return {"message": "Report created successfully"}


@router.get("/")
def get_reports(db: Session = Depends(get_db)):
    return db.query(models.Report).all()
