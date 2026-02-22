from dotenv import load_dotenv
load_dotenv()


from fastapi import FastAPI
from sqlalchemy import text
from backend.database import SessionLocal
from backend.routers import auth
from fastapi.middleware.cors import CORSMiddleware

from backend.database import engine
from backend.models import Base
Base.metadata.create_all(bind=engine)


app = FastAPI(title="Water Quality Monitor")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API running"}

@app.get("/test-db")
def test_db():
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"status": "Database connected"}
    finally:
        db.close()

app.include_router(auth.router)


from backend.routers import reports

app.include_router(reports.router)

from backend.routers import stations

app.include_router(stations.router)

from backend.routers.alerts import router as alerts_router

app.include_router(alerts_router)



from backend.routers.collaborations import router as collaboration_router
app.include_router(collaboration_router)


