from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.models import Report
from app.schemas import ReportCreate, ReportReview
from app.deps import get_current_user

router = APIRouter(prefix="/reports")


@router.post("/")
def create_report(

    report: ReportCreate,
    session: Session = Depends(get_session),
    current_user = Depends(get_current_user)

):

    new_report = Report(

        **report.dict(),
        user_id=current_user.id

    )

    session.add(new_report)

    session.commit()

    session.refresh(new_report)

    return new_report


@router.get("/")
def get_reports(session: Session = Depends(get_session)):

    reports = session.exec(select(Report)).all()

    return reports


@router.put("/{report_id}")
def review_report(

    report_id: int,
    review: ReportReview,
    session: Session = Depends(get_session)

):

    report = session.get(Report, report_id)

    report.status = review.status

    session.commit()

    return report
