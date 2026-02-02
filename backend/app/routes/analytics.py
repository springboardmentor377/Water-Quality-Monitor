from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Report
from app.utils import require_role

router = APIRouter(prefix="/analytics", tags=["Analytics"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/predict")
def predict(
    db: Session = Depends(get_db),
    user=Depends(require_role(["ngo", "admin"]))
):
    reports = db.query(Report).all()
    unsafe = len([r for r in reports if r.status == "rejected"])

    risk = "High" if unsafe > 5 else "Low"

    return {
        "total_reports": len(reports),
        "risk_level": risk
    }
