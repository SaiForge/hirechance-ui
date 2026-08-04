from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import shutil
from typing import Any
from app.database.connection import get_db
from app.models.user import User, Resume
from app.api.dependencies import get_current_user
from app.services.resume_service import ResumeService
from app.services.recommend_service import recommend_service

router = APIRouter()
resume_service = ResumeService()

UPLOAD_DIR = "data/raw/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    file_location = f"{UPLOAD_DIR}/{current_user.id}_{file.filename}"
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    # Parse resume
    parsed_data = resume_service.parse_resume(file_location)
    score = resume_service.score_resume(parsed_data)
    
    # Save to db
    db_resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_location,
        parsed_data=parsed_data,
        ats_score=score,
        parsing_confidence=0.85
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    
    # get recommendations
    raw_text = parsed_data.get("raw_text", "")
    print(f"[Resume] raw_text length: {len(raw_text)}")
    print(f"[Resume] raw_text preview: {raw_text[:200] if raw_text else 'EMPTY'}")
    recommendations = []
    recommend_error = None
    if raw_text:
        try:
            raw_matches = recommend_service.recommend_jobs(raw_text)
            print(f"[Resume] Got {len(raw_matches)} raw matches")
            recommendations = [
                {
                    "Company": m.get('Company', 'N/A'),
                    "Job_Title": m.get('Job_Title', 'N/A'),
                    "Description": m.get('Description', ''),
                    "Location": m.get('Location', 'N/A'),
                    "Final_Score": m.get('Final_Score', 0.0),
                    "Possibility": m.get('Possibility (%)', m.get('Possibility', 0.0)),
                    "Job_URL": m.get('Job_URL', 'N/A'),
                    "Insights": m.get('Insights', {})
                }
                for m in raw_matches
            ]
        except Exception as e:
            import traceback
            tb_str = traceback.format_exc()
            recommend_error = f"{e}\n\nTraceback:\n{tb_str}"
            print(f"[Resume] Error getting recommendations:\n{tb_str}")
    else:
        recommend_error = "raw_text is empty — PDF may not have been parsed correctly"

    return {
        "id": db_resume.id,
        "filename": file.filename,
        "ats_score": score,
        "parsed_data": parsed_data,
        "recommendations": recommendations,
        "recommend_error": recommend_error
    }
