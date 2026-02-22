from pydantic import BaseModel, ConfigDict
from datetime import datetime

class WaterStationCreate(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    managed_by: str

class WaterStationOut(BaseModel):
    id: int
    name: str
    location: str
    latitude: float
    longitude: float
    managed_by: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
