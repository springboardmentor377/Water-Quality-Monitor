from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Station

router = APIRouter(prefix="/stations", tags=["Stations"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_stations(db: Session = Depends(get_db)):
    # This now pulls from your PostgreSQL 'stations' table
    stations = db.query(Station).all()
    
    # If database is empty, return a fallback or empty list
    if not stations:
        return [
            {"id": 1, "name": "Chennai Main Station", "lat": 13.0827, "lng": 80.2707},
            {"id": 2, "name": "Adyar River Point", "lat": 13.0067, "lng": 80.2578}
        ]
    return stations