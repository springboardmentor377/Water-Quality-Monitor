from fastapi import FastAPI,Depends
from sqlalchemy.orm import Session
from database import Base,engine,SessionLocal
from models import Users,WaterStations
from fetch_data import fetch_waterstations
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_methods=["*"],
allow_headers=["*"]
)

Base.metadata.create_all(bind=engine)
fetch_waterstations()

def get_db():
 db=SessionLocal()
 try: yield db
 finally: db.close()

@app.post("/login")
def login(username:str,password:str,db:Session=Depends(get_db)):
 user=db.query(Users).filter(Users.name==username).first()
 if not user:
    user=Users(name=username,password=password)
    db.add(user)
    db.commit()
 return {"success":True}

@app.get("/stations")
def stations(db:Session=Depends(get_db)):
 return db.query(WaterStations).all()