from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# CRITICAL: Never hardcode database credentials
# Set this in your .env file or environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable must be set. "
        "Example: postgresql://username:password@localhost/dbname"
    )

# Production settings
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using
    pool_size=10,        # Connection pool size
    max_overflow=20,     # Max connections beyond pool_size
    echo=False           # Set to True for SQL debugging
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()


def get_db():
    """Database dependency for FastAPI routes"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()