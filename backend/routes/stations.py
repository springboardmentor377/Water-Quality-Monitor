from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/stations", tags=["Stations"])


@router.get("/")
def get_stations(db: Session = Depends(get_db)):
    return db.query(models.WaterStation).all()


@router.get("/{station_id}/readings")
def get_readings(station_id: int, db: Session = Depends(get_db)):
    return db.query(models.StationReading).filter(
        models.StationReading.station_id == station_id
    ).all()
