from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Report
from app.utils import require_role

router = APIRouter(prefix="/analytics", tags=["Analytics"])


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
