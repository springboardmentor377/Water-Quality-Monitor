from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlmodel import Session, select

from app.database import get_session
from app.auth import decode_token
from app.models import User

security = HTTPBearer()


def get_current_user(

    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)

):

    token = credentials.credentials

    try:

        payload = decode_token(token)

        email = payload["sub"]

        user = session.exec(

            select(User).where(User.email == email)

        ).first()

        if not user:
            raise HTTPException(status_code=401)

        return user

    except Exception:

        raise HTTPException(status_code=401)
