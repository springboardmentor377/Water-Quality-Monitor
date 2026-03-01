from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str
    location: str


class UserLogin(BaseModel):
    email: str
    password: str


class ReportCreate(BaseModel):
    user_id: int
    photo_url: Optional[str] = None
    location: str
    description: str
    water_source: str


class StationCreate(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    managed_by: str
