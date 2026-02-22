import os
import uuid
from fastapi import UploadFile, HTTPException
from PIL import Image
import aiofiles
from typing import Optional

# Configuration
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/gif"}

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_upload_file(upload_file: UploadFile) -> str:
    """
    Save uploaded file and return the file path/URL
    """
    # Validate file
    if not upload_file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    file_extension = os.path.splitext(upload_file.filename)[1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    if upload_file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"MIME type not allowed. Allowed types: {', '.join(ALLOWED_MIME_TYPES)}"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    try:
        async with aiofiles.open(file_path, 'wb') as f:
            content = await upload_file.read()
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
                )
            await f.write(content)
        
        # Validate and optionally resize image
        try:
            with Image.open(file_path) as img:
                # Verify it's actually an image
                img.verify()
                
                # Reopen for resizing (verify() closes the file)
                with Image.open(file_path) as img:
                    # Resize if too large (max width 1920px)
                    if img.width > 1920:
                        ratio = 1920 / img.width
                        new_height = int(img.height * ratio)
                        img = img.resize((1920, new_height), Image.Resampling.LANCZOS)
                        img.save(file_path, optimize=True, quality=85)
                        
        except Exception as e:
            # If image processing fails, delete the file and raise error
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Return relative path (can be used to construct URL)
        return f"/{UPLOAD_DIR}/{unique_filename}"
        
    except HTTPException:
        raise
    except Exception as e:
        # Clean up file if something went wrong
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail="Failed to save file")

def delete_file(file_path: str) -> bool:
    """
    Delete a file from the upload directory
    """
    try:
        # Remove leading slash if present
        clean_path = file_path.lstrip('/')
        full_path = os.path.join(os.getcwd(), clean_path)
        
        if os.path.exists(full_path) and os.path.isfile(full_path):
            os.remove(full_path)
            return True
        return False
    except Exception:
        return False
