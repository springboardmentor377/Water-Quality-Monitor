from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import User
from app.schemas import UserRegister, UserLogin
from app.auth import create_token, hash_password, verify_password
from app.deps import get_current_user

router = APIRouter(prefix="/auth")


@router.post("/register")
def register(user: UserRegister, session: Session = Depends(get_session)):

    existing = session.exec(

        select(User).where(User.email == user.email)

    ).first()

    if existing:

        raise HTTPException(status_code=400, detail="Email exists")

    # Hash the password before storing
    hashed_password = hash_password(user.password)
    new_user_data = user.dict()
    new_user_data['password'] = hashed_password

    new_user = User(**new_user_data)

    session.add(new_user)

    session.commit()

    session.refresh(new_user)

    return {"message": "Registered successfully"}


@router.post("/login")
def login(user: UserLogin, session: Session = Depends(get_session)):

    db_user = session.exec(

        select(User).where(User.email == user.email)

    ).first()

    if not db_user or not verify_password(user.password, db_user.password):

        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(db_user)

    return {"access_token": token}


@router.get("/profile")
def profile(current_user: User = Depends(get_current_user)):

    return current_user