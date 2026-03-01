from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String)
    location = Column(String)
    created_at = Column(DateTime, server_default=func.now())


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    photo_url = Column(String)
    location = Column(String)
    description = Column(Text)
    water_source = Column(String)
    status = Column(String, default="pending")
    created_at = Column(DateTime, server_default=func.now())


class WaterStation(Base):
    __tablename__ = "waterstations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    managed_by = Column(String)
    created_at = Column(DateTime, server_default=func.now())


class StationReading(Base):
    __tablename__ = "stationreadings"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer)
    parameter = Column(String)
    value = Column(Float)
    recorded_at = Column(DateTime, server_default=func.now())
