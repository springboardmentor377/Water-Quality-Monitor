from pydantic import BaseModel
from typing import Optional
from pydantic import Field
from datetime import datetime


class UserRegister(BaseModel):

    name: str
    email: str
    password: str
    role: Optional[str] = "citizen"
    location: Optional[str] = None


class UserLogin(BaseModel):

    email: str
    password: str


class ReportCreate(BaseModel):

    photo_url: Optional[str] = None
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: str
    water_source: Optional[str] = None
    station_id: Optional[int] = None
    alert_id: Optional[int] = None  # Reference to the alert if this report is for an alert


class ReportReview(BaseModel):

    status: str


class StationReadingCreate(BaseModel):

    station_id: int
    parameter: str  # pH, turbidity, DO, lead, arsenic
    value: float


class AlertCreate(BaseModel):

    type: str  # boil_notice, contamination, outage
    message: str
    location: str
    station_id: Optional[int] = None
    reading_id: Optional[int] = None


class CollaborationCreate(BaseModel):

    project_name: str
    contact_email: str
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class CollaborationUpdate(BaseModel):

    ngo_name: Optional[str] = None
    project_name: Optional[str] = None
    contact_email: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None  # active, completed, suspended


class PredictiveAlertCreate(BaseModel):

    station_id: int
    parameter: str  # pH, turbidity, DO, lead, arsenic
    predicted_value: float
    confidence_level: float  # 0.0 to 1.0
    risk_level: str  # low, medium, high, critical
    expires_at: datetime  # When this prediction expires
    
    # Details about the prediction
    model_used: Optional[str] = None  # Name of the model used
    threshold_exceeded: bool = Field(default=False)  # Whether threshold was exceeded
    alert_message: Optional[str] = None  # Custom message for the alert


class PredictiveAlertUpdate(BaseModel):

    predicted_value: Optional[float] = None
    confidence_level: Optional[float] = None
    risk_level: Optional[str] = None
    is_active: Optional[bool] = None
    threshold_exceeded: Optional[bool] = None
    alert_message: Optional[str] = None