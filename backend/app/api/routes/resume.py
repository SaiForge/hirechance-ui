from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
import os
import uuid
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

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    # 1. Validate file extension
    original_filename = os.path.basename(file.filename or "resume.pdf")
    ext = os.path.splitext(original_filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file format '{ext}'. Only PDF (.pdf) and Word (.docx) files are supported."
        )

    # 2. Read content and validate size
    content = file.file.read()
    if len(content) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File size exceeds the 10 MB limit.")

    # 3. Save with safe UUID filename to prevent path traversal
    safe_stored_filename = f"{current_user.id}_{uuid.uuid4().hex}{ext}"
    file_location = os.path.join(UPLOAD_DIR, safe_stored_filename)

    with open(file_location, "wb") as file_object:
        file_object.write(content)

    # 4. Parse resume
    parsed_data = resume_service.parse_resume(file_location)
    score = resume_service.score_resume(parsed_data)

    # 5. Save to database
    db_resume = Resume(
        user_id=current_user.id,
        filename=original_filename,
        file_path=file_location,
        parsed_data=parsed_data,
        ats_score=score,
        parsing_confidence=0.85
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    # 6. Generate recommendations
    raw_text = parsed_data.get("raw_text", "")
    recommendations = []
    recommend_error = None

    if raw_text:
        try:
            raw_matches = recommend_service.recommend_jobs(raw_text)
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
            print(f"[Resume] Error generating recommendations: {e}\n{traceback.format_exc()}")
            recommend_error = "Job recommendation model is currently unavailable. Please try again shortly."
    else:
        recommend_error = "Could not extract text from the resume. Please ensure the document is not password-protected or scanned as an image."

    return {
        "id": db_resume.id,
        "filename": original_filename,
        "ats_score": score,
        "parsed_data": parsed_data,
        "recommendations": recommendations,
        "recommend_error": recommend_error
    }
