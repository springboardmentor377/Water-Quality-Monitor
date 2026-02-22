from pydantic import BaseModel
from datetime import datetime
from backend.models.enums import ReadingParameter

class TrendPoint(BaseModel):
    recorded_at: datetime
    value: float

class StationStats(BaseModel):
    station_id: int
    parameter: ReadingParameter
    avg: float
    min: float
    max: float

class PredictionOut(BaseModel):
    station_id: int
    parameter: ReadingParameter
    predicted_value: float
    basis: str
