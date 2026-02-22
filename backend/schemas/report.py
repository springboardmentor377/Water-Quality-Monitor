from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from backend.models.enums import ReportStatus

class ReportCreate(BaseModel):
    location: str
    description: str
    water_source: str

class ReportOut(BaseModel):
    id: int
    user_id: int
    photo_url: Optional[str]
    location: str
    description: str
    water_source: str
    status: ReportStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ReportStatusUpdate(BaseModel):
    status: ReportStatus
