from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import enum


class UserRole(enum.Enum):
    CITIZEN = "citizen"
    NGO = "ngo"
    AUTHORITY = "authority"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.CITIZEN, nullable=False)
    location = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    reports = relationship("Report", back_populates="user", foreign_keys="Report.user_id")
    verified_reports = relationship("Report", foreign_keys="Report.verified_by", back_populates="verifier")


class ReportStatus(enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    photo_url = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    water_source = Column(String, nullable=False)
    status = Column(Enum(ReportStatus), default=ReportStatus.PENDING, nullable=False)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    review_note = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="reports", foreign_keys=[user_id])
    verifier = relationship("User", back_populates="verified_reports", foreign_keys=[verified_by])
    images = relationship("ReportImage", back_populates="report")


class StationStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class WaterStation(Base):
    __tablename__ = "waterstations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    managed_by = Column(String, nullable=False)
    status = Column(Enum(StationStatus), default=StationStatus.ACTIVE, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    readings = relationship("StationReading", back_populates="station")
    alerts = relationship("Alert", back_populates="station")


class WaterParameter(enum.Enum):
    PH = "pH"
    TURBIDITY = "turbidity"
    DO = "DO"
    LEAD = "lead"
    ARSENIC = "arsenic"


class StationReading(Base):
    __tablename__ = "stationreadings"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("waterstations.id"), nullable=False)
    parameter = Column(Enum(WaterParameter), nullable=False)
    value = Column(Float, nullable=False)
    recorded_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    station = relationship("WaterStation", back_populates="readings")


class AlertType(enum.Enum):
    BOIL_NOTICE = "boil_notice"
    CONTAMINATION = "contamination"
    OUTAGE = "outage"


class AlertSeverity(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(AlertType), nullable=False)
    severity = Column(Enum(AlertSeverity), default=AlertSeverity.MEDIUM, nullable=False)
    message = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    station_id = Column(Integer, ForeignKey("waterstations.id"), nullable=True)
    expires_at = Column(DateTime, nullable=True)
    issued_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    station = relationship("WaterStation", back_populates="alerts")


class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, index=True)
    ngo_name = Column(String, nullable=False)
    project_name = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    status = Column(String, default="planned", nullable=False)
    volunteers_count = Column(Integer, nullable=True)
    budget = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())


class ReportImage(Base):
    __tablename__ = "reportimages"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    photo_url = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    report = relationship("Report", back_populates="images")
