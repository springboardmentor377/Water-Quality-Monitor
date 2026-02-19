try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging
from app.database import SessionLocal, engine
from app import models
from app.models import User
from passlib.context import CryptContext
from sqlalchemy.orm import Session

# Create tables
models.Base.metadata.create_all(bind=engine)

from app.routes.reports import router as reports_router
from app.routes.user import router as user_router
from app.routes.stations import router as stations_router
from app.routes.analytics import router as analytics_router
from app.routes.water_data import router as water_data_router
from app.routes.ngo import router as ngo_router
from app.routes.dashboard import router as dashboard_router
from app.config import UPLOAD_DIR

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Water Quality Monitoring API",
    description="API for reporting and monitoring water pollution",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
# In production, replace with your actual frontend URL
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    max_age=3600  # Cache preflight requests for 1 hour
)

# Serve uploaded files (in production, use a CDN or object storage)
if os.path.exists(UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(user_router)
app.include_router(reports_router)
app.include_router(stations_router)
app.include_router(analytics_router)
app.include_router(water_data_router)
app.include_router(ngo_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    """Root endpoint - API health check"""
    return {
        "message": "Water Quality Monitoring API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "water-quality-api"
    }


from sqlalchemy import text

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("Starting Water Quality Monitoring API")
    logger.info(f"Allowed CORS origins: {allowed_origins}")
    
    # Create upload directory if it doesn't exist
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    logger.info(f"Upload directory: {UPLOAD_DIR}")

    # FIX: Add missing columns to alerts table
    try:
        with engine.connect() as conn:
            # Check/Add status
            conn.execute(text("ALTER TABLE alerts ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'active'"))
            # Check/Add station_name
            conn.execute(text("ALTER TABLE alerts ADD COLUMN IF NOT EXISTS station_name VARCHAR DEFAULT 'Unknown Station'"))
            # Check/Add level
            conn.execute(text("ALTER TABLE alerts ADD COLUMN IF NOT EXISTS level VARCHAR DEFAULT 'Info'"))
            # Check/Add message
            conn.execute(text("ALTER TABLE alerts ADD COLUMN IF NOT EXISTS message VARCHAR DEFAULT 'No message'"))
            # Check/Add created_at
            conn.execute(text("ALTER TABLE alerts ADD COLUMN IF NOT EXISTS created_at VARCHAR DEFAULT '2024-01-01'"))
            
            conn.commit()
            logger.info("Checked/Added missing columns to 'alerts' table")
    except Exception as e:
        logger.warning(f"Schema check warning (ignore if using SQLite): {e}")

    # Seed Admin User
    db: Session = SessionLocal()
    try:
        admin_email = "admin123@gmail.com"
        admin_pass = "Admin@123"
        
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)
        
        # Check if admin exists
        user = db.query(User).filter(User.email == admin_email).first()
        
        hashed_password = pwd_context.hash(admin_pass)
        
        if not user:
            # Create new admin
            new_admin = User(
                name="System Admin",
                email=admin_email,
                password=hashed_password,
                role="admin"
            )
            db.add(new_admin)
            db.commit()
            logger.info(f"Created default admin user: {admin_email}")
        else:
            # Update existing admin to ensure correct password and role
            user.password = hashed_password
            user.role = "admin"
            db.commit()
            logger.info(f"Updated default admin user: {admin_email}")
            
    except Exception as e:
        logger.error(f"Error seeding admin user: {e}")
        db.rollback()
    finally:
        db.close()


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("Shutting down Water Quality Monitoring API")