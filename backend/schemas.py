from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import UserRole, ReportStatus, AlertType, AlertSeverity, WaterParameter


# ---------------- USERS ----------------

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.CITIZEN
    location: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole
    location: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------------- STATIONS ----------------

class StationCreate(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    managed_by: str


class StationResponse(BaseModel):
    id: int
    name: str
    location: str
    latitude: float
    longitude: float
    managed_by: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------- REPORTS ----------------

class ReportCreate(BaseModel):
    description: str
    water_source: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ReportResponse(BaseModel):
    id: int
    user_id: int
    description: str
    water_source: str
    latitude: Optional[float]
    longitude: Optional[float]
    photo_url: Optional[str]
    status: ReportStatus
    verified_by: Optional[int]
    review_note: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------------- ALERTS ----------------

class AlertCreate(BaseModel):
    type: Optional[AlertType] = AlertType.CONTAMINATION
    severity: AlertSeverity = AlertSeverity.MEDIUM
    message: str
    location: str
    station_id: Optional[int] = None
    expires_at: Optional[datetime] = None


class AlertResponse(BaseModel):
    id: int
    type: AlertType
    severity: AlertSeverity
    message: str
    location: str
    station_id: Optional[int]
    expires_at: Optional[datetime]
    issued_at: datetime
    created_at: Optional[datetime] = None  # Alias for issued_at for frontend compatibility
    active: Optional[bool] = None  # Computed field

    class Config:
        from_attributes = True
class ReadingCreate(BaseModel):
    parameter: WaterParameter
    value: float


class ReadingResponse(BaseModel):
    id: int
    station_id: int
    parameter: WaterParameter
    value: float
    recorded_at: datetime

    class Config:
        from_attributes = True


# ---------------- COLLABORATIONS ----------------

class CollaborationCreate(BaseModel):
    ngo_name: str
    project_name: str
    contact_email: EmailStr
    description: Optional[str] = None
    location: Optional[str] = None
    status: str = "planned"
    volunteers_count: Optional[int] = None
    budget: Optional[float] = None


class CollaborationResponse(BaseModel):
    id: int
    ngo_name: str
    project_name: str
    contact_email: EmailStr
    description: Optional[str]
    location: Optional[str]
    status: str
    volunteers_count: Optional[int]
    budget: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------- TOKEN ----------------

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
