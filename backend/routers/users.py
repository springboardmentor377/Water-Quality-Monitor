from fastapi import APIRouter, Depends
from backend.core.deps import get_current_user
from backend.schemas.user import UserOut

router = APIRouter()

@router.get("/me", response_model=UserOut)
def me(current_user = Depends(get_current_user)):
    return current_user
