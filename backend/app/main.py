from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_db
from app.routers import auth, stations, reports, alerts, collaborations, predictive_alerts, ngo_projects, dashboard

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # During development allow all origins to avoid mismatched-dev-port CORS issues.
    # For production restrict this to your frontend origin(s).
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    create_db()

app.include_router(auth.router)
app.include_router(stations.router)
app.include_router(reports.router)
app.include_router(alerts.router)
app.include_router(collaborations.router)
app.include_router(predictive_alerts.router)
app.include_router(ngo_projects.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"message": "Water Quality Monitor API is running!"}