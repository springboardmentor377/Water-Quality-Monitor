<<<<<<< HEAD
from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional
import re


class UserCreate(BaseModel):
    """Schema for user registration"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    role: Optional[str] = "citizen"
    
    @validator('password')
    def validate_password_strength(cls, v):
        """Enforce strong password requirements"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        
        return v
    
    @validator('name')
    def validate_name(cls, v):
        """Validate name field"""
        if not v.strip():
            raise ValueError('Name cannot be empty or whitespace')
        
        # Remove extra whitespace
        return ' '.join(v.split())


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user data in responses"""
    id: int
    name: str
    email: str
    role: str
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str = "bearer"


class ReportCreate(BaseModel):
    """Schema for creating a report"""
    description: str = Field(..., min_length=10, max_length=1000)
    location: str = Field(..., min_length=3, max_length=200)
    water_source: str = Field(..., min_length=2, max_length=100)
    station_name: str = Field(..., min_length=2, max_length=200)
    
    @validator('description', 'location', 'water_source', 'station_name')
    def remove_extra_whitespace(cls, v):
        """Clean up whitespace in text fields"""
        return ' '.join(v.split())


class ReportResponse(BaseModel):
    """Schema for report data in responses"""
    id: int
    description: str
    location: str
    water_source: str
    station_name: str
    photo_url: str
    status: str
    user_id: Optional[int] = None
    
    class Config:
        from_attributes = True


class ReportAction(BaseModel):
    """Schema for verifying/rejecting reports"""
    report_id: int
    verified: bool


class StationResponse(BaseModel):
    """Schema for station data"""
    id: int
    name: str
    lat: float
    lng: float
    
    class Config:
        from_attributes = True

class NGOProjectCreate(BaseModel):
    """Schema for creating an NGO project"""
    project_name: str = Field(..., min_length=2, max_length=200)
    contact_email: EmailStr
    description: Optional[str] = None
    
    @validator('project_name')
    def validate_project_name(cls, v):
        if not v.strip():
            raise ValueError('Project name cannot be empty or whitespace')
        return ' '.join(v.split())

class NGOProjectResponse(BaseModel):
    """Schema for NGO project response"""
    id: int
    project_name: str
    contact_email: str
    description: Optional[str]
    owner_id: int
    
    class Config:
        from_attributes = True

class AlertResponse(BaseModel):
    id: int
    station_name: str
    level: str
    message: str
    status: str
    created_at: str
    
    class Config:
        from_attributes = True


class CollaborationCreate(BaseModel):
    """Schema for creating a collaboration"""
    ngo_name: str = Field(..., min_length=2, max_length=200)
    project_name: str = Field(..., min_length=2, max_length=200)
    contact_email: EmailStr
    
    @validator('ngo_name', 'project_name')
    def validate_names(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty or whitespace')
        return ' '.join(v.split())


class CollaborationResponse(BaseModel):
    """Schema for collaboration response"""
    id: int
    ngo_name: str
    project_name: str
    contact_email: str
    created_at: str
    
    class Config:
        from_attributes = True

=======
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
>>>>>>> origin/main
