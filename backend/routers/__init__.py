from fastapi import APIRouter
from backend.routers import auth, users, reports, stations, alerts, collaborations, analytics

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(stations.router, prefix="/stations", tags=["stations"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(collaborations.router, prefix="/collaborations", tags=["collaborations"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
