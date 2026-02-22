from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.core.deps import get_db, get_current_user, require_roles
from backend.models.enums import UserRole
from backend.models.water_station import WaterStation
from backend.models.station_reading import StationReading
from backend.schemas.water_station import WaterStationCreate, WaterStationOut
from backend.schemas.station_reading import StationReadingCreate, StationReadingOut

router = APIRouter()

@router.post("/", response_model=WaterStationOut)
def create_station(
    station: WaterStationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles(UserRole.admin, UserRole.authority)),
):
    new_station = WaterStation(**station.model_dump())
    db.add(new_station)
    db.commit()
    db.refresh(new_station)
    return new_station

@router.get("/", response_model=List[WaterStationOut])
def list_stations(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(WaterStation).order_by(WaterStation.created_at.desc()).all()

@router.post("/{station_id}/readings", response_model=StationReadingOut)
def add_reading(
    station_id: int,
    reading: StationReadingCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles(UserRole.admin, UserRole.authority)),
):
    station = db.query(WaterStation).filter(WaterStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    new_reading = StationReading(station_id=station_id, **reading.model_dump())
    db.add(new_reading)
    db.commit()
    db.refresh(new_reading)
    return new_reading

@router.get("/{station_id}/readings", response_model=List[StationReadingOut])
def list_readings(
    station_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return (
        db.query(StationReading)
        .filter(StationReading.station_id == station_id)
        .order_by(StationReading.recorded_at.desc())
        .all()
    )
