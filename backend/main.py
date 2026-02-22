from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< main


from fastapi.middleware.cors import CORSMiddleware


=======
>>>>>>> swathi_narsingoji
from sqlalchemy import text

from database import SessionLocal, engine
from models import Base
<<<<<<< main


from models import User, Report, WaterStation, StationReading, Alert

from routers.auth import router as auth_router
from routers.reports import router as reports_router
from routers.stations import router as stations_router
from routers.alerts import router as alerts_router

=======
from models import User, Report, WaterStation, StationReading, Alert
>>>>>>> swathi_narsingoji

from routers.auth import router as auth_router
from routers.reports import router as reports_router
from routers.stations import router as stations_router
from routers.alerts import router as alerts_router
from routers.dashboard import router as dashboard_router

app = FastAPI(title="Water Quality Monitor")

<<<<<<< main



Base.metadata.create_all(bind=engine)



=======
Base.metadata.create_all(bind=engine)

>>>>>>> swathi_narsingoji
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Water Quality Monitor API running"}


@app.get("/test-db")
def test_db():
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"status": "Database connected successfully"}
    finally:
        db.close()

app.include_router(auth_router)
app.include_router(reports_router, prefix="/reports")
app.include_router(stations_router, prefix="/stations")
app.include_router(alerts_router, prefix="/alerts")
<<<<<<< main


app.include_router(auth_router)
app.include_router(reports_router, prefix="/reports")
app.include_router(stations_router, prefix="/stations")

=======
app.include_router(dashboard_router)
>>>>>>> swathi_narsingoji
