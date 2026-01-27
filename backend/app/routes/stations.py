from fastapi import APIRouter

router = APIRouter(prefix="/stations", tags=["Stations"])

@router.get("/")
def get_stations():
    return [
        {
            "name": "Station A",
            "lat": 13.0827,
            "lng": 80.2707
        }
    ]
