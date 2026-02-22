from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.core.deps import get_db, get_current_user, require_roles
from backend.models.enums import UserRole
from backend.models.collaboration import Collaboration
from backend.schemas.collaboration import CollaborationCreate, CollaborationOut

router = APIRouter()

@router.post("/", response_model=CollaborationOut)
def create_collaboration(
    payload: CollaborationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_roles(UserRole.ngo, UserRole.admin, UserRole.authority)),
):
    collaboration = Collaboration(**payload.model_dump())
    db.add(collaboration)
    db.commit()
    db.refresh(collaboration)
    return collaboration

@router.get("/", response_model=List[CollaborationOut])
def list_collaborations(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return db.query(Collaboration).order_by(Collaboration.created_at.desc()).all()
