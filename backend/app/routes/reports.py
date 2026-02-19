from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from pathlib import Path
import os
import shutil
import uuid
import logging

from app.database import get_db
from app.models import Report, User
from app.auth import require_role, get_current_user
from app.config import UPLOAD_DIR, MAX_FILE_SIZE, ALLOWED_EXTENSIONS

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reports", tags=["Reports"])

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)


def validate_and_save_file(file: UploadFile) -> str:
    """
    Validate and save uploaded file securely
    
    Returns the saved file path
    Raises HTTPException if validation fails
    """
    # Check file exists
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file uploaded"
        )
    
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()  # Get position (file size)
    file.file.seek(0)  # Reset to beginning
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / (1024*1024):.1f}MB"
        )
    
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty file uploaded"
        )
    
    # Generate secure filename (prevent path traversal attacks)
    safe_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"File saved successfully: {safe_filename}")
        return file_path
    
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save file"
        )


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_report(
    description: str = Form(..., min_length=10, max_length=1000),
    location: str = Form(..., min_length=3, max_length=200),
    water_source: str = Form(..., min_length=2, max_length=100),
    station_name: str = Form(..., min_length=2, max_length=200),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["citizen"]))
):
    """
    Submit a new pollution report
    
    - **description**: Detailed description of the pollution (10-1000 characters)
    - **location**: Location of the pollution incident
    - **water_source**: Type of water source (e.g., River, Lake, Well)
    - **station_name**: Name of nearest monitoring station
    - **file**: Photo evidence (JPG, PNG, GIF, WEBP - Max 5MB)
    
    Requires authentication. Returns the created report.
    """
    logger.info(f"Report creation attempt by user: {current_user.get('email')}")
    
    # Validate and save file
    file_path = validate_and_save_file(file)
    
    # Get user from database
    user = db.query(User).filter(User.email == current_user["email"]).first()
    
    # Create report
    new_report = Report(
        description=description.strip(),
        location=location.strip(),
        water_source=water_source.strip(),
        station_name=station_name.strip(),
        photo_url=file_path,
        status="pending",
        user_id=user.id if user else None
    )
    
    try:
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        
        logger.info(f"Report created successfully - ID: {new_report.id}")
        
        return {
            "message": "Report submitted successfully",
            "report_id": new_report.id,
            "status": new_report.status
        }
    
    except Exception as e:
        db.rollback()
        # Delete uploaded file if database operation fails
        if os.path.exists(file_path):
            os.remove(file_path)
        
        logger.error(f"Error creating report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create report"
        )


@router.get("/")
def get_reports(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get all pollution reports with pagination
    
    - **skip**: Number of records to skip (default: 0)
    - **limit**: Maximum number of records to return (default: 100, max: 100)
    - **status_filter**: Filter by status (pending, verified, rejected)
    
    Requires authentication.
    """
    # Limit maximum records per request
    if limit > 100:
        limit = 100
    
    query = db.query(Report)
    
    # Apply status filter if provided
    if status_filter:
        if status_filter not in ["pending", "verified", "rejected"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status filter. Must be: pending, verified, or rejected"
            )
        query = query.filter(Report.status == status_filter)
    
    # Get total count
    total = query.count()
    
    # Get paginated results
    reports = query.offset(skip).limit(limit).all()
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "reports": reports
    }


@router.get("/{report_id}")
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific report by ID
    
    Requires authentication.
    """
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    return report


@router.post("/action")
def report_action(
    report_id: int = Form(...),
    verified: bool = Form(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["authority", "admin", "ngo"]))
):
    """
    Verify or reject a pollution report
    
    - **report_id**: ID of the report to update
    - **verified**: True to verify, False to reject
    
    Requires authority or admin role.
    """
    logger.info(f"Report action by {current_user.get('email')} - Report ID: {report_id}, Verified: {verified}")
    
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check if already processed
    if report.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Report already {report.status}"
        )
    
    # Update status
    new_status = "verified" if verified else "rejected"
    report.status = new_status
    
    try:
        db.commit()
        logger.info(f"Report {report_id} status updated to: {new_status}")
        
        return {
            "message": f"Report {new_status} successfully",
            "report_id": report_id,
            "status": new_status
        }
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating report status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update report status"
        )


@router.delete("/{report_id}")
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role(["admin"]))
):
    """
    Delete a report (admin only)
    
    Also deletes the associated photo file.
    """
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Delete photo file
    if report.photo_url and os.path.exists(report.photo_url):
        try:
            os.remove(report.photo_url)
            logger.info(f"Deleted photo file: {report.photo_url}")
        except Exception as e:
            logger.error(f"Error deleting photo file: {str(e)}")
    
    try:
        db.delete(report)
        db.commit()
        logger.info(f"Report {report_id} deleted by admin: {current_user.get('email')}")
        
        return {"message": "Report deleted successfully"}
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete report"
        )