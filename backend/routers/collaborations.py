from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Collaboration, CollaborationCreate, CollaborationResponse

router = APIRouter(prefix="/collaborations", tags=["Collaborations"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=CollaborationResponse)
def create_collaboration(
    data: CollaborationCreate,
    db: Session = Depends(get_db)
):
    collaboration = Collaboration(**data.dict())
    db.add(collaboration)
    db.commit()
    db.refresh(collaboration)
    return collaboration


@router.get("/", response_model=list[CollaborationResponse])
def get_collaborations(db: Session = Depends(get_db)):
    return db.query(Collaboration).all()