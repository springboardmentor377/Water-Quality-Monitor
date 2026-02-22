from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.core.deps import get_db, get_current_user
from backend.models.station_reading import StationReading
from backend.models.enums import ReadingParameter
from backend.schemas.analytics import TrendPoint, StationStats, PredictionOut

router = APIRouter()

@router.get("/trends", response_model=List[TrendPoint])
def trends(
    station_id: int,
    parameter: Optional[ReadingParameter] = None,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    query = db.query(StationReading).filter(StationReading.station_id == station_id)
    if parameter:
        query = query.filter(StationReading.parameter == parameter)
    readings = query.order_by(StationReading.recorded_at.desc()).limit(limit).all()
    return [TrendPoint(recorded_at=r.recorded_at, value=float(r.value)) for r in readings]

@router.get("/stats", response_model=List[StationStats])
def stats(
    station_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    rows = (
        db.query(
            StationReading.parameter,
            func.avg(StationReading.value),
            func.min(StationReading.value),
            func.max(StationReading.value),
        )
        .filter(StationReading.station_id == station_id)
        .group_by(StationReading.parameter)
        .all()
    )
    return [
        StationStats(
            station_id=station_id,
            parameter=row[0],
            avg=float(row[1]),
            min=float(row[2]),
            max=float(row[3]),
        )
        for row in rows
    ]

@router.get("/predict", response_model=PredictionOut)
def predict(
    station_id: int,
    parameter: ReadingParameter,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    last = (
        db.query(StationReading)
        .filter(StationReading.station_id == station_id, StationReading.parameter == parameter)
        .order_by(StationReading.recorded_at.desc())
        .first()
    )
    if not last:
        raise HTTPException(status_code=404, detail="No readings found for station")
    return PredictionOut(
        station_id=station_id,
        parameter=parameter,
        predicted_value=float(last.value),
        basis="Last observed value",
    )
