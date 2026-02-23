<<<<<<< HEAD
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, default="citizen") 

class Station(Base):
    __tablename__ = "stations"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    lat = Column(Float)
    lng = Column(Float)

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True)
    description = Column(String)
    water_source = Column(String)
    # Satisfies Requirement #3: Added station_name
    station_name = Column(String) 
    photo_url = Column(String)
    location = Column(String)
    status = Column(String, default="pending") 
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

class NGOProject(Base):
    __tablename__ = "ngo_projects"
    id = Column(Integer, primary_key=True)
    project_name = Column(String)
    contact_email = Column(String)
    description = Column(String, nullable=True)
    created_at = Column(String, nullable=True) 
    owner_id = Column(Integer, ForeignKey("users.id"))

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True)
    station_name = Column(String)
    level = Column(String) # High, Critical, Warning
    message = Column(String)
    status = Column(String, default="active") # active, resolved
    created_at = Column(String) # Timestamp string

class Collaboration(Base):
    __tablename__ = "collaborations"
    id = Column(Integer, primary_key=True)
    ngo_name = Column(String)
    project_name = Column(String)
    contact_email = Column(String)
    created_at = Column(String)
=======
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, default="citizen")  # citizen | ngo | authority | admin


class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    lat = Column(Float)
    lng = Column(Float)


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    description = Column(String)
    water_source = Column(String)
    photo_url = Column(String)
    location = Column(String)

    station_id = Column(Integer, ForeignKey("stations.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    status = Column(String, default="pending")  # pending | verified | rejected
>>>>>>> origin/main
