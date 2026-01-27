from sqlalchemy import Column,Integer,String,Float,DateTime,Enum,ForeignKey
from database import Base
from datetime import datetime
import enum

class Role(enum.Enum):
    citizen="citizen"
    ngo="ngo"
    authority="authority"
    admin="admin"

class Parameter(enum.Enum):
    ph="ph"
    turbidity="turbidity"
    DO="DO"

class Users(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True)
    name=Column(String)
    email=Column(String)
    password=Column(String)
    role=Column(Enum(Role))
    location=Column(String)
    created_at=Column(DateTime,default=datetime.utcnow)

class WaterStations(Base):
    __tablename__="waterstations"
    id=Column(Integer,primary_key=True)
    station_id=Column(Integer)
    name=Column(String)
    location=Column(String)
    latitude=Column(Float)
    longitude=Column(Float)
    managed_by=Column(String)

class StationReadings(Base):
    __tablename__="stationreadings"
    id=Column(Integer,primary_key=True)
    station_id=Column(Integer,ForeignKey("waterstations.station_id"))
    parameter=Column(Enum(Parameter))
    value=Column(Float)
    recorded_at=Column(DateTime,default=datetime.utcnow)