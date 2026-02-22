from sqlalchemy import Column, Integer, String, TIMESTAMP,DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base
from sqlalchemy import ForeignKey, Text,Float
from pydantic import BaseModel, EmailStr, Field
from typing import Literal,Optional
from datetime import datetime
from backend.database import Base

#Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String)
    location = Column(String)
    created_at = Column(TIMESTAMP, server_default=func.now())

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    role: str
    location: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    photo_url = Column(String)
    location = Column(String)
    description = Column(Text)
    water_source = Column(String)
    status = Column(String, default="pending")
    created_at = Column(TIMESTAMP, server_default=func.now())
    alert_id = Column(Integer, nullable=True)


class ReportCreate(BaseModel):
    photo_url: str
    location: str
    description: str
    water_source: str
    alert_id: Optional[int] = None



class WaterStation(Base):
    __tablename__ = "water_stations"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    managed_by = Column(String)
    created_at = Column(TIMESTAMP, server_default=func.now())


class StationReading(Base):
    __tablename__ = "station_readings"

    id = Column(Integer, primary_key=True)
    station_id = Column(Integer, ForeignKey("water_stations.id"))
    parameter = Column(String)
    value = Column(Float)
    recorded_at = Column(TIMESTAMP, server_default=func.now())

class StationCreate(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    managed_by: str

class ReportActionSchema(BaseModel):
    action: str



class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    alert_type = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    location = Column(String, nullable=False)

    station_id = Column(Integer, nullable=True)
    report_id = Column(Integer, nullable=True)

    created_at = Column(
        TIMESTAMP,
        default=datetime.utcnow
    )
class StationReadingCreate(BaseModel):
    parameter: str
    value: float

class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, index=True)
    ngo_name = Column(String, nullable=False)
    project_name = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class CollaborationCreate(BaseModel):
    ngo_name: str
    project_name: str
    contact_email: str

class CollaborationResponse(BaseModel):
    id: int
    ngo_name: str
    project_name: str
    contact_email: str

    class Config:
        from_attributes = True


