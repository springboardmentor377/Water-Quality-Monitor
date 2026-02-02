from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str
from typing import Optional

class ReportCreate(BaseModel):
    location: str
    description: str
    water_source: str
    station_name: str
    photo_url: Optional[str] = None
