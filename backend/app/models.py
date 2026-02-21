from sqlalchemy import Column, Integer, String, Text,Numeric, Enum,Float, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database import Base

import enum
from datetime import datetime,timezone


class RoleEnum(str, enum.Enum):
    citizen = "citizen"
    ngo = "ngo"
    authority = "authority"
    admin = "admin"


class ReportStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(Enum(RoleEnum), default=RoleEnum.citizen)
    location = Column(String)
    created_at = Column(TIMESTAMP, default=lambda: datetime.now(timezone.utc))


    reports = relationship("Report", back_populates="user")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    photo_url = Column(String)
    location = Column(String)
    description = Column(Text)
    water_source = Column(String)
    status = Column(Enum(ReportStatus), default=ReportStatus.pending)
    created_at = Column(TIMESTAMP, default=lambda: datetime.now(timezone.utc))


    user = relationship("User", back_populates="reports")


# ---------------- WATER STATIONS ----------------

class WaterStation(Base):
    __tablename__ = "water_stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String)
    latitude = Column(Numeric)
    longitude = Column(Numeric)
    managed_by = Column(String)
    created_at = Column(TIMESTAMP, default=lambda: datetime.now(timezone.utc))


class StationReading(Base):
    __tablename__ = "station_readings"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("water_stations.id"))
    parameter = Column(
        Enum('pH','turbidity','DO','lead','arsenic', name="water_parameter"),
        nullable=False
    )
    value = Column(Numeric, nullable=False)
    recorded_at = Column(TIMESTAMP, default=lambda: datetime.now(timezone.utc))

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(
        Enum("boil_notice", "contamination", "outage", name="alert_type"),
        nullable=False
    )
    message = Column(Text, nullable=False)
    location = Column(String, nullable=True)
    issued_at = Column(TIMESTAMP, default=lambda: datetime.now(timezone.utc))

class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, index=True)
    ngo_name = Column(String, nullable=False)
    project_name = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, default=lambda: datetime.now(timezone.utc))





# class WaterStation(Base):
#     __tablename__ = "stations"
#     id = Column(Integer, primary_key=True)
#     name = Column(String)
#     latitude = Column(Float)
#     longitude = Column(Float)
#     location_name = Column(String)

# class StationReading(Base):
#     __tablename__ = "readings"
#     id = Column(Integer, primary_key=True)
#     station_id = Column(Integer, ForeignKey("stations.id"))
#     parameter = Column(String) # e.g., 'pH', 'turbidity'
#     value = Column(Float)
#     recorded_at = Column(TIMESTAMP, default=lambda: datetime.now(timezone.utc))
