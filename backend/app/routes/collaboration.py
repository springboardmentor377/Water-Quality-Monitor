from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db
from app.models import Collaboration
from app.schemas import CollaborationCreate, CollaborationResponse

router = APIRouter(prefix="/collaborations", tags=["Collaborations"])

@router.post("/", response_model=CollaborationResponse)
def create_collaboration(data: CollaborationCreate, db: Session = Depends(get_db)):
    new_item = Collaboration(**data.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.get("/", response_model=List[CollaborationResponse])
def get_collaborations(db: Session = Depends(get_db)):
    return db.query(Collaboration).all()
