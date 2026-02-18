from app.database import engine
from sqlmodel import Session
from app.seed import seed_data

# Create (re)create database tables — drop existing tables first for development
from app.models import SQLModel
# WARNING: drop_all will remove existing tables/data; safe for local dev only
SQLModel.metadata.drop_all(bind=engine)
SQLModel.metadata.create_all(bind=engine)

# Seed with sample data
with Session(engine) as session:
    seed_data(session)

print("✅ Database tables created and seeded successfully")