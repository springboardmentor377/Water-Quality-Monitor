
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import SQLModel, Session, create_engine, select
from models import User
import jwt
from pydantic import BaseModel

app = FastAPI()

DATABASE_URL = "mysql+mysqlconnector://root:Nayan%40123@localhost/fastapi_db"
engine = create_engine(DATABASE_URL, echo=True)

# Create tables
SQLModel.metadata.create_all(engine)

SECRET_KEY = "JdHcLJgiX52GQ_-60xoTvBUsLR55lN-qH-MdSwQRLtU"
ALGORITHM = "HS256"


from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "citizen"
    location: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


@app.post("/register")
def register(user: UserCreate):
    with Session(engine) as session:
        db_user = session.exec(select(User).where(User.email == user.email)).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already exists")
        new_user = User(
            name=user.name,
            email=user.email,
            password=user.password,
            role=user.role,
            location=user.location
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role,
            "location": new_user.location,
            "created_at": new_user.created_at
        }


@app.post("/login")
def login(user: UserLogin):
    with Session(engine) as session:
        db_user = session.exec(select(User).where(User.email == user.email)).first()
        if not db_user or db_user.password != user.password:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token_data = {"sub": db_user.email, "id": db_user.id, "role": db_user.role}
        token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": token}


@app.post("/profile")
def profile(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        with Session(engine) as session:
            db_user = session.exec(select(User).where(User.email == email)).first()
            if not db_user:
                raise HTTPException(status_code=404, detail="User not found")
            return {
                "id": db_user.id,
                "name": db_user.name,
                "email": db_user.email,
                "role": db_user.role,
                "location": db_user.location,
                "created_at": db_user.created_at
            }
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

