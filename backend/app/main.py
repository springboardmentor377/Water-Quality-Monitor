from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
import app.models
from app.routes import user, reports
from app.routes import stations,alerts,collaboration



app = FastAPI(title="Water Quality Monitor")

# ✅ CORS should be added immediately after app creation
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(user.router)
app.include_router(reports.router)
app.include_router(stations.router)
app.include_router(alerts.router)
app.include_router(collaboration.router)

@app.get("/")
def root():
    return {"status": "Backend working"}
