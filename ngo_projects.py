from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(tags=["NGO Projects"])

@router.post("/ngo-project", response_model=schemas.CollaborationResponse)
def create_project(
    project: schemas.CollaborationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_project = models.Collaboration(**project.dict())
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/ngo-projects", response_model=List[schemas.CollaborationResponse])
def get_projects(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Collaboration)
    
    if status:
        query = query.filter(models.Collaboration.status == status)
    
    return query.order_by(models.Collaboration.created_at.desc()).all()
