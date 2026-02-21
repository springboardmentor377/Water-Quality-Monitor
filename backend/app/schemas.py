# ---------------- STATION SCHEMAS ----------------
from pydantic import BaseModel
from datetime import datetime

 
class StationResponse(BaseModel):
    id: int
    name: str
    location: str | None
    latitude: float
    longitude: float
    managed_by: str | None

    class Config:
        from_attributes = True


class ReadingResponse(BaseModel):
    id: int
    station_id: int
    parameter: str
    value: float
    recorded_at: datetime

class AlertCreate(BaseModel):
    type: str
    message: str
    location: str | None = None


class AlertResponse(BaseModel):
    id: int
    type: str
    message: str
    location: str | None
    issued_at: datetime

    class Config:
        from_attributes = True


# -------- Collaboration --------

class CollaborationCreate(BaseModel):
    ngo_name: str
    project_name: str
    contact_email: str


class CollaborationResponse(BaseModel):
    id: int
    ngo_name: str
    project_name: str
    contact_email: str
    created_at: datetime


    class Config:
        from_attributes = True
