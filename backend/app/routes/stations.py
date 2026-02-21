from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db
from app.models import WaterStation, StationReading
from app.schemas import StationResponse, ReadingResponse

router = APIRouter(prefix="/stations", tags=["Stations"])


@router.get("/", response_model=List[StationResponse])
def get_stations(db: Session = Depends(get_db)):
    return db.query(WaterStation).all()


@router.get("/readings/{station_id}", response_model=List[ReadingResponse])
def get_readings(station_id: int, db: Session = Depends(get_db)):
    return db.query(StationReading).filter(
        StationReading.station_id == station_id
    ).all()

@router.get("/with-latest")
def get_stations_with_latest(db: Session = Depends(get_db)):
    stations = db.query(WaterStation).all()
    result = []

    for station in stations:
        latest = {}

        for param in ["pH", "turbidity", "lead"]:
            record = (
                db.query(StationReading)
                .filter(
                    StationReading.station_id == station.id,
                    StationReading.parameter == param
                )
                .order_by(StationReading.recorded_at.desc())
                .first()
            )

            if record:
                latest[param] = record.value

        result.append({
            "id": station.id,
            "name": station.name,
            "location": station.location,
            "latitude": station.latitude,
            "longitude": station.longitude,
            "latest": latest
        })

    return result
    return result

    return result