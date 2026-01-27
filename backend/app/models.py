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
