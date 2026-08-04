from pydantic import BaseModel
from typing import List, Optional, Any

class RecommendationRequest(BaseModel):
    resume_text: str

class Insights(BaseModel):
    Semantic_Score: float
    Skill_Score: float
    Experience_Score: float
    Brand_Score: float
    Education_Score: float
    Matched_Skills: List[str]
    Missing_Skills: List[str]
    Experience_Feedback: str
    Pedigree_Feedback: str

class JobMatch(BaseModel):
    Company: str
    Job_Title: str
    Description: str
    Final_Score: float
    Location: Optional[str] = "N/A"
    Job_URL: Optional[str] = "N/A"
    Insights: Insights

class RecommendationResponse(BaseModel):
    total_matches: int
    recommendations: List[JobMatch]
