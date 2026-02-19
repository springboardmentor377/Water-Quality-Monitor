from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from app.database import get_db
from app.models import NGOProject, User
from app.schemas import NGOProjectCreate, NGOProjectResponse
from app.auth import require_role, get_current_user

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["NGO Projects"])

@router.post("/ngo-project", response_model=NGOProjectResponse, status_code=status.HTTP_201_CREATED)
def create_ngo_project(
    data: NGOProjectCreate, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(require_role(["ngo"]))
):
    """
    Create a new NGO project (NGO only)
    
    - **project_name**: Name of the project
    - **contact_email**: Contact email for the project
    - **description**: Optional description
    """
    logger.info(f"Project creation attempt by {current_user['email']} for project: {data.project_name}")
    
    # Create new project
    new_project = NGOProject(
        project_name=data.project_name,
        contact_email=data.contact_email,
        description=data.description,
        owner_id=current_user["user_id"]
        # created_at can be added here if we want to handle it manually or default in DB
    )
    
    try:
        db.add(new_project)
        db.commit()
        db.refresh(new_project)
        logger.info(f"Project created successfully: {new_project.project_name}")
        
        return new_project
    
    except Exception as e:
        db.rollback()
        logger.error(f"Project creation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during project creation"
        )

@router.get("/ngo-projects", response_model=List[NGOProjectResponse])
def get_ngo_projects(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["ngo"]))
):
    """
    Get all NGO projects (NGO only)
    """
    projects = db.query(NGOProject).all()
    return projects
