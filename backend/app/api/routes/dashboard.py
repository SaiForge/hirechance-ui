from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Any
from app.database.connection import get_db
from app.models.user import User, Resume
from app.api.dependencies import get_current_user

router = APIRouter()

@router.get("/")
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    resume_count = db.query(Resume).filter(Resume.user_id == current_user.id).count()
    
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "resumes_count": resume_count,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at
    }
