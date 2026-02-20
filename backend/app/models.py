from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class User(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)

    name: str
    email: str = Field(unique=True)
    password: str

    role: str = Field(default="citizen")

    location: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)


class WaterStation(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)

    name: str
    latitude: float
    longitude: float

    location: Optional[str] = None

    managed_by: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)


class StationReading(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)

    station_id: int

    parameter: str  # pH, turbidity, DO, lead, arsenic
    value: float

    recorded_at: datetime = Field(default_factory=datetime.utcnow)


class Alert(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)

    type: str  # boil_notice, contamination, outage
    message: str
    location: str
    station_id: Optional[int] = None
    reading_id: Optional[int] = None  # Reference to the reading that triggered the alert
    issued_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)


class Report(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int

    photo_url: Optional[str] = None

    location: str
    
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    description: str

    water_source: Optional[str] = None

    station_id: Optional[int] = None
    
    alert_id: Optional[int] = None  # Reference to the alert if this report is for an alert

    status: str = Field(default="pending")

    created_at: datetime = Field(default_factory=datetime.utcnow)


class Notification(SQLModel, table=True):
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    user_id: int
    
    title: str
    message: str
    
    type: str = Field(default="info")  # info, warning, alert, success
    
    is_read: bool = Field(default=False)
    
    related_report_id: Optional[int] = None
    related_alert_id: Optional[int] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AnalyticsReport(SQLModel, table=True):
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    title: str
    description: str
    
    report_type: str  # weekly, monthly, quarterly, custom
    
    data: str  # JSON data for the report
    
    generated_by: int  # User ID who generated the report
    
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    
    file_path: Optional[str] = None  # Path to exported file


class PredictionModel(SQLModel, table=True):
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    station_id: int
    parameter: str
    
    model_data: str  # JSON with model parameters and predictions
    
    accuracy_score: Optional[float] = None
    
    last_trained: datetime = Field(default_factory=datetime.utcnow)
    
    is_active: bool = Field(default=True)


class Collaboration(SQLModel, table=True):
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    user_id: int  # Foreign key to User table
    project_name: str
    contact_email: str
    
    description: Optional[str] = None
    start_date: Optional[datetime] = Field(default_factory=datetime.utcnow)
    end_date: Optional[datetime] = None
    status: str = Field(default="active")  # active, completed, suspended
    
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PredictiveAlert(SQLModel, table=True):
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    station_id: int
    parameter: str  # pH, turbidity, DO, lead, arsenic
    predicted_value: float
    confidence_level: float  # 0.0 to 1.0
    risk_level: str  # low, medium, high, critical
    
    predicted_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime  # When this prediction expires
    is_active: bool = Field(default=True)
    
    # Details about the prediction
    model_used: Optional[str] = None  # Name of the model used
    threshold_exceeded: bool = Field(default=False)  # Whether threshold was exceeded
    alert_message: Optional[str] = None  # Custom message for the alert
    
    created_at: datetime = Field(default_factory=datetime.utcnow)