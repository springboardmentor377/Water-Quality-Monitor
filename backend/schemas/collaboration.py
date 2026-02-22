from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CollaborationCreate(BaseModel):
    ngo_name: str
    project_name: str
    contact_email: str

class CollaborationOut(BaseModel):
    id: int
    ngo_name: str
    project_name: str
    contact_email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
