from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from backend.models.enums import AlertType

class AlertCreate(BaseModel):
    type: AlertType
    message: str
    location: str
    station_id: Optional[int] = None
    report_id: Optional[int] = None

class AlertOut(BaseModel):
    id: int
    type: AlertType
    message: str
    location: str
    station_id: Optional[int]
    report_id: Optional[int]
    issued_at: datetime

    model_config = ConfigDict(from_attributes=True)
