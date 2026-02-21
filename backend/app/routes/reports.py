from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app import models
from app.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/")
def get_reports(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role.value == "citizen":
        return db.query(models.Report).filter(
            models.Report.user_id == current_user.id
        ).all()

    return db.query(models.Report).all()

@router.post("/")
def create_report(
    location: str,
    description: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_report = models.Report(
        user_id=current_user.id,
        location=location,
        description=description,
        water_source="Unknown"
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report




@router.get("/")
def get_reports(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Report).all()