from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from datetime import datetime
from typing import List

from app.database import get_session
from app.models import Collaboration
from app.schemas import CollaborationCreate, CollaborationUpdate
from app.deps import get_current_user

router = APIRouter(prefix="/collaborations")


@router.get("/", response_model=List[dict])
def get_collaborations(current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    # Check if the user is an NGO
    if current_user.get("role") not in ["ngo", "admin"]:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Only NGO users can view collaborations")
    
    collaborations = session.exec(select(Collaboration)).all()
    result = []
    for collab in collaborations:
        # Get the user who created the collaboration to get their name
        from app.models import User
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


@router.get("/{collaboration_id}", response_model=dict)
def get_collaboration(collaboration_id: int, session: Session = Depends(get_session)):
    collaboration = session.get(Collaboration, collaboration_id)
    if not collaboration:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Collaboration not found")
    
    return {
        "id": collaboration.id,
        "ngo_name": collaboration.ngo_name,
        "project_name": collaboration.project_name,
        "contact_email": collaboration.contact_email,
        "description": collaboration.description,
        "start_date": collaboration.start_date,
        "end_date": collaboration.end_date,
        "status": collaboration.status,
        "created_at": collaboration.created_at
    }


@router.post("/", response_model=dict)
def create_collaboration(
    collaboration_create: CollaborationCreate, 
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Check if the user is an NGO
    if current_user.get("role") not in ["ngo", "admin"]:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Only NGO users can create collaborations")
    
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
    
    # Return user's name instead of ngo_name for display purposes
    from app.models import User
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


@router.put("/{collaboration_id}", response_model=dict)
def update_collaboration(
    collaboration_id: int, 
    collaboration_update: CollaborationUpdate, 
    session: Session = Depends(get_session)
):
    collaboration = session.get(Collaboration, collaboration_id)
    if not collaboration:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Collaboration not found")
    
    # Update fields that are provided
    for field, value in collaboration_update.dict(exclude_unset=True).items():
        setattr(collaboration, field, value)
    
    session.add(collaboration)
    session.commit()
    session.refresh(collaboration)
    
    return {
        "id": collaboration.id,
        "ngo_name": collaboration.ngo_name,
        "project_name": collaboration.project_name,
        "contact_email": collaboration.contact_email,
        "description": collaboration.description,
        "start_date": collaboration.start_date,
        "end_date": collaboration.end_date,
        "status": collaboration.status,
        "created_at": collaboration.created_at
    }


@router.delete("/{collaboration_id}")
def delete_collaboration(collaboration_id: int, session: Session = Depends(get_session)):
    collaboration = session.get(Collaboration, collaboration_id)
    if not collaboration:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Collaboration not found")
    
    session.delete(collaboration)
    session.commit()
    
    return {"message": "Collaboration deleted successfully"}