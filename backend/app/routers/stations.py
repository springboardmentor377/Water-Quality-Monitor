from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from datetime import datetime
from typing import List

from app.database import get_session
from app.models import WaterStation, StationReading, Alert
from app.schemas import StationReadingCreate

router = APIRouter(prefix="/stations")


@router.get("/")
def get_stations(session: Session = Depends(get_session)):
    stations = session.exec(select(WaterStation)).all()
    return stations


@router.get("/{station_id}/readings", response_model=List[dict])
def get_station_readings(station_id: int, session: Session = Depends(get_session)):
    readings = session.exec(
        select(StationReading)
        .where(StationReading.station_id == station_id)
        .order_by(StationReading.recorded_at.desc())
    ).all()
    
    return [
        {
            "id": reading.id,
            "parameter": reading.parameter,
            "value": reading.value,
            "recorded_at": reading.recorded_at
        }
        for reading in readings
    ]


@router.post("/{station_id}/readings")
def create_station_reading(
    station_id: int,
    reading_data: StationReadingCreate,
    session: Session = Depends(get_session)
):
    # Verify the station exists
    station = session.get(WaterStation, station_id)
    if not station:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Station not found")
    
    # Create the reading
    reading = StationReading(
        station_id=station_id,
        parameter=reading_data.parameter,
        value=reading_data.value
    )
    session.add(reading)
    session.commit()
    session.refresh(reading)
    
    # Check if the reading exceeds thresholds and create an alert if needed
    # Threshold values based on WHO standards
    thresholds = {
        "pH": {"min": 6.5, "max": 8.5},
        "turbidity": {"max": 5.0},  # NTU
        "DO": {"min": 5.0},  # mg/L dissolved oxygen
        "lead": {"max": 0.01},  # mg/L
        "arsenic": {"max": 0.01}  # mg/L
    }
    
    param = reading_data.parameter
    value = reading_data.value
    
    # Check if value exceeds threshold
    alert_needed = False
    alert_message = ""
    
    if param in thresholds:
        threshold = thresholds[param]
        if "min" in threshold and value < threshold["min"]:
            alert_needed = True
            alert_message = f"{param.upper()} level too low: {value} (threshold: >{threshold['min']})"
        elif "max" in threshold and value > threshold["max"]:
            alert_needed = True
            alert_message = f"{param.upper()} level too high: {value} (threshold: <{threshold['max']})"
    
    if alert_needed:
        # Create an alert
        alert = Alert(
            type="contamination",
            message=alert_message,
            location=station.location or station.name,
            station_id=station_id,
            reading_id=reading.id
        )
        session.add(alert)
        session.commit()
    
    return {
        "id": reading.id,
        "station_id": reading.station_id,
        "parameter": reading.parameter,
        "value": reading.value,
        "recorded_at": reading.recorded_at
    }