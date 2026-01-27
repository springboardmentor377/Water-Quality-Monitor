from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes.user import router as user_router
from app.routes.stations import router as stations_router
from app.routes.reports import router as reports_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(stations_router)
app.include_router(reports_router)

@app.get("/")
def root():
    return {"message": "Backend running"}
