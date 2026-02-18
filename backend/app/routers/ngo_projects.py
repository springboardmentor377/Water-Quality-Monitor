from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from datetime import datetime
from typing import List

from app.database import get_session
from app.models import Collaboration, User
from app.schemas import CollaborationCreate
from app.deps import get_current_user

router = APIRouter(prefix="/ngo-projects")


@router.post("/", response_model=dict)
def create_ngo_project(
    collaboration_create: CollaborationCreate, 
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Check if the user is an NGO
    if current_user.get("role") not in ["ngo", "admin"]:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Only NGO users can create projects")
    
    collaboration = Collaboration(
        user_id=current_user.get("user_id"),
        project_name=collaboration_create.project_name,
        contact_email=collaboration_create.contact_email,
        description=collaboration_create.description,
        start_date=collaboration_create.start_date,
        end_date=collaboration_create.end_date
    )
    session.add(collaboration)
    session.commit()
    session.refresh(collaboration)
    
    # Get the user who created the collaboration to get their name
    user = session.get(User, current_user.get("user_id"))
    
    return {
        "id": collaboration.id,
        "ngo_name": user.name if user else "Unknown",
        "project_name": collaboration.project_name,
        "contact_email": collaboration.contact_email,
        "description": collaboration.description,
        "start_date": collaboration.start_date,
        "end_date": collaboration.end_date,
        "status": collaboration.status,
        "created_at": collaboration.created_at
    }


@router.get("/", response_model=List[dict])
def get_ngo_projects(
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Check if the user role is ngo
    if current_user.get("role") != "ngo" and current_user.get("role") != "admin":
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Only NGO users can view their projects")
    
    # Get only projects created by the current user
    collaborations = session.exec(
        select(Collaboration).where(Collaboration.user_id == current_user.get("user_id"))
    ).all()
    
    result = []
    for collab in collaborations:
        # Get the user who created the collaboration to get their name
        user = session.get(User, collab.user_id)
        result.append({
            "id": collab.id,
            "ngo_name": user.name if user else "Unknown",
            "project_name": collab.project_name,
            "contact_email": collab.contact_email,
            "description": collab.description,
            "start_date": collab.start_date,
            "end_date": collab.end_date,
            "status": collab.status,
            "created_at": collab.created_at
        })
    
    return result