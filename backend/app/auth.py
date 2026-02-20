import jwt
from datetime import datetime, timedelta

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"

ALGORITHM = "HS256"

EXPIRE_MINUTES = 60


def create_token(user):

    payload = {

        "sub": user.email,
        "id": user.id,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)

    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token):

    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])


def hash_password(password):
    # Simple hash for demo purposes - in production, use bcrypt
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password, hashed_password):
    import hashlib
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password