from sqlmodel import SQLModel, create_engine, Session
import os

# Use SQLite for development
DATABASE_URL = "sqlite:///./water_quality.db"

engine = create_engine(DATABASE_URL, echo=True)


def create_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session