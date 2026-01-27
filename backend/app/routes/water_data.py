from fastapi import APIRouter

router = APIRouter(
    prefix="/water-data",
    tags=["Water Data"]
)

@router.get("/live")
def get_live_water_data():
    return [
        {
            "station": "Station A",
            "ph": 7.2,
            "tds": 280,
            "status": "Safe",
            "lat": 13.0827,
            "lng": 80.2707
        },
        {
            "station": "Station B",
            "ph": 5.6,
            "tds": 620,
            "status": "Unsafe",
            "lat": 12.9716,
            "lng": 77.5946
        }
    ]
