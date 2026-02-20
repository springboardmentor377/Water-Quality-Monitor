from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas
from auth import get_current_user, require_authority_or_admin
from datetime import datetime, timedelta

router = APIRouter(tags=["Water Stations"])

# ---------------------------------------------------
# Seed 40 Real Indian Water Stations (One Time Only)
# ---------------------------------------------------
def seed_real_40_stations(db: Session):
    if db.query(models.WaterStation).count() > 0:
        return

    stations = [
        ("Yamuna - Delhi", 28.6139, 77.2090),
        ("Ganga - Varanasi", 25.3176, 82.9739),
        ("Ganga - Haridwar", 29.9457, 78.1642),
        ("Ganga - Patna", 25.5941, 85.1376),
        ("Ganga - Kolkata", 22.5726, 88.3639),
        ("Godavari - Nashik", 19.9975, 73.7898),
        ("Godavari - Rajahmundry", 16.9891, 81.7780),
        ("Krishna - Vijayawada", 16.5062, 80.6480),
        ("Krishna - Sangli", 16.8524, 74.5815),
        ("Cauvery - Mysore", 12.2958, 76.6394),
        ("Cauvery - Bangalore", 12.9716, 77.5946),
        ("Brahmaputra - Guwahati", 26.1445, 91.7362),
        ("Mahanadi - Cuttack", 20.4625, 85.8830),
        ("Narmada - Jabalpur", 23.1815, 79.9864),
        ("Tapi - Surat", 21.1702, 72.8311),
        ("Indus - Leh", 34.1526, 77.5771),
        ("Ganga - Rishikesh", 30.0869, 78.2676),
        ("Yamuna - Agra", 27.1767, 78.0081),
        ("Ganga - Kanpur", 26.4499, 80.3319),
        ("Godavari - Aurangabad", 19.8762, 75.3433),
        ("Krishna - Satara", 17.6827, 74.0150),
        ("Cauvery - Tiruchirappalli", 10.7905, 78.7047),
        ("Brahmaputra - Dibrugarh", 27.4785, 94.9119),
        ("Mahanadi - Sambalpur", 21.4664, 83.9769),
        ("Narmada - Hoshangabad", 22.7496, 77.7249),
        ("Tapi - Bhusawal", 21.0464, 75.7873),
        ("Indus - Srinagar", 34.0837, 74.7973),
        ("Ganga - Allahabad", 25.4358, 81.8463),
        ("Yamuna - Prayagraj", 25.4358, 81.8463),
        ("Godavari - Nanded", 19.1539, 77.3117),
        ("Krishna - Vijayawada", 16.5062, 80.6480),
        ("Cauvery - Kumbakonam", 10.9617, 79.3857),
        ("Brahmaputra - Tezpur", 26.6575, 92.7938),
        ("Mahanadi - Bhubaneswar", 20.2961, 85.8245),
        ("Narmada - Bharuch", 21.7075, 72.9976),
        ("Tapi - Malegaon", 20.5566, 74.5310),
        ("Indus - Jammu", 32.7266, 74.8570),
        ("Ganga - Farakka", 24.8155, 88.0694),
        ("Yamuna - Delhi-Noida Border", 28.5957, 77.3293),
        ("Godavari - Nashik-Triambak", 19.9314, 73.5496),
    ]

    for name, lat, lon in stations:
        station = models.WaterStation(
            name=name,
            location=f"{name.split(' - ')[1]}",
            latitude=lat,
            longitude=lon,
            status="active"
        )
        db.add(station)

    db.commit()


# Helper functions
def get_stations(
    status: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    seed_real_40_stations(db)
    query = db.query(models.WaterStation)
    
    # Apply filters
    if status:
        query = query.filter(models.WaterStation.status == status)
    if location:
        query = query.filter(models.WaterStation.location.contains(location))
    
    return query.all()


def create_station(
    station: schemas.StationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_authority_or_admin)
):
    new_station = models.WaterStation(**station.dict())
    db.add(new_station)
    db.commit()
    db.refresh(new_station)
    return new_station


def get_station_readings(
    station_id: int,
    parameter: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Verify station exists
    station = db.query(models.WaterStation).filter(models.WaterStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    
    query = db.query(models.StationReading).filter(models.StationReading.station_id == station_id)
    
    # Apply filters
    if parameter:
        query = query.filter(models.StationReading.parameter == parameter)
    if start_date:
        query = query.filter(models.StationReading.recorded_at >= start_date)
    if end_date:
        query = query.filter(models.StationReading.recorded_at <= end_date)
    
    return query.order_by(models.StationReading.recorded_at.desc()).limit(100).all()


# Water Station endpoints for API compatibility
@router.post("/waterstation", response_model=schemas.StationResponse)
def create_waterstation(
    station: schemas.StationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_authority_or_admin)
):
    return create_station(station, db, current_user)


@router.get("/waterstations", response_model=List[schemas.StationResponse])
def get_waterstations(
    status: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return get_stations(status, location, db, current_user)


@router.get("/waterstation-readings/{station_id}", response_model=List[schemas.ReadingResponse])
def get_waterstation_readings(
    station_id: int,
    parameter: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return get_station_readings(station_id, parameter, start_date, end_date, db, current_user)
