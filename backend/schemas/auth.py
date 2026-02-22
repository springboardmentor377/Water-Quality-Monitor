from pydantic import BaseModel
from backend.models.enums import UserRole

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
