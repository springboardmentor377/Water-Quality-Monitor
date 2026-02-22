from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
from pathlib import Path

router = APIRouter(tags=["Images"])

UPLOAD_DIR = Path("uploads")

@router.get("/image/{photo_name}")
def get_image(photo_name: str):
    """
    Serve uploaded images by filename
    """
    file_path = UPLOAD_DIR / photo_name
    
    # Check if file exists
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Return the file
    return FileResponse(
        path=str(file_path),
        media_type="image/jpeg",  # You might want to detect the actual media type
        filename=photo_name
    )
