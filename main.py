from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import users, reports, stations, alerts, dashboard, ngo_projects, images

app = FastAPI(
    title="Water Quality Monitoring System API",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(reports.router)
app.include_router(stations.router)
app.include_router(alerts.router)
app.include_router(dashboard.router)
app.include_router(ngo_projects.router, prefix="/api")

# Root-level endpoints to match Swagger UI
app.include_router(users.auth_router)
app.include_router(reports.report_router, prefix="/report", tags=["Report"])
app.include_router(alerts.alert_router, prefix="/alert", tags=["Alert"])
app.include_router(images.router)
