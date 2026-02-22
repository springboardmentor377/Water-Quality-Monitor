from pydantic import BaseModel, ConfigDict
from datetime import datetime
from backend.models.enums import ReadingParameter

class StationReadingCreate(BaseModel):
    parameter: ReadingParameter
    value: float

class StationReadingOut(BaseModel):
    id: int
    station_id: int
    parameter: ReadingParameter
    value: float
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)
