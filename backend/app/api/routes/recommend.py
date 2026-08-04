from fastapi import APIRouter, HTTPException, Depends
from typing import Any
from app.schemas.recommend import RecommendationRequest, RecommendationResponse, JobMatch
from app.services.recommend_service import recommend_service

router = APIRouter()

@router.post("/predict", response_model=RecommendationResponse)
def get_recommendations(payload: RecommendationRequest) -> Any:
    if not payload.resume_text or len(payload.resume_text.strip()) == 0:
        raise HTTPException(status_code=400, detail="resume_text must not be empty.")

    try:
        raw_matches = recommend_service.recommend_jobs(payload.resume_text)
        
        matches = [
            JobMatch(
                Company=m.get('Company', 'N/A'),
                Job_Title=m.get('Job_Title', 'N/A'),
                Description=m.get('Description', ''),
                Final_Score=m.get('Final_Score', 0.0),
                Location=m.get('Location', 'N/A'),
                Job_URL=m.get('Job_URL', 'N/A'),
                Insights=m.get('Insights', {})
            )
            for m in raw_matches
        ]
        
        return RecommendationResponse(
            total_matches=len(matches),
            recommendations=matches
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")
