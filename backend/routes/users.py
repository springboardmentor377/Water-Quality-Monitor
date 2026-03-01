from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import hash_password, verify_password

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user_data = user.dict()
    user_data["password"] = hash_password(user_data["password"])
    new_user = models.User(**user_data)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


@router.post("/login")
def login(data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.email == data.email
    ).first()

    if not user:
        new_user = models.User(
            name=data.email.split("@")[0] if data.email else "user",
            email=data.email,
            password=hash_password(data.password),
            role="user",
            location="",
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "Login successful", "user_id": new_user.id}

    is_valid = False
    if user.password:
        try:
            is_valid = verify_password(data.password, user.password)
        except Exception:
            is_valid = user.password == data.password

    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if user.password == data.password:
        user.password = hash_password(data.password)
        db.add(user)
        db.commit()

    return {"message": "Login successful", "user_id": user.id}
