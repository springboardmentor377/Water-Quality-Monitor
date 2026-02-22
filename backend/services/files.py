from pathlib import Path
from uuid import uuid4
import shutil
from fastapi import UploadFile
from backend.core.config import settings


def get_uploads_dir() -> Path:
    path = Path(settings.uploads_dir)
    path.mkdir(parents=True, exist_ok=True)
    return path


def save_upload_file(upload: UploadFile) -> str:
    uploads_dir = get_uploads_dir()
    suffix = Path(upload.filename).suffix if upload.filename else ""
    filename = f"{uuid4().hex}{suffix}"
    dest = uploads_dir / filename
    with dest.open("wb") as buffer:
        shutil.copyfileobj(upload.file, buffer)
    return filename
