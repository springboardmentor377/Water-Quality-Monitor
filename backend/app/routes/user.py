from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.database import SessionLocal
from app.models import User
from app.schemas import UserCreate, UserLogin
from app.auth import create_token

router = APIRouter(tags=["Auth"])

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ REGISTER
@router.post("/register")
def register(data: UserCreate, db: Session = Depends(get_db)):

    # ✅ FIXED: use data.email (NOT data["email"])
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    hashed_password = pwd_context.hash(data.password)

    new_user = User(
        name=data.name,
        email=data.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

# ✅ LOGIN
@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == data.email).first()

    if not db_user or not pwd_context.verify(data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_token({
        "sub": db_user.email,
        "role": db_user.role
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
