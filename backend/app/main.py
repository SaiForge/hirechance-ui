from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, resume, dashboard, recommend
from app.database.connection import engine, Base
import app.models.user  # Ensure SQLAlchemy models are registered

from app.core.config import settings

# Create database tables safely
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Database initialization skipped or failed during startup: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Core backend service for user authentication, management, resume parsing, and AI job recommendations.",
    version=settings.VERSION
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(resume.router, prefix="/api/v1/resume", tags=["Resume"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(recommend.router, prefix="/api/v1/recommend", tags=["Recommendation"])


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/debug/model")
def debug_model():
    """Debug endpoint to diagnose ML model issues."""
    import os
    from pathlib import Path

    info = {}

    # 1. Check model.pkl locations
    model_paths = [
        "model.pkl", "app/model.pkl", "/app/model.pkl"
    ]
    info["model_pkl_search"] = {}
    for p in model_paths:
        exists = os.path.exists(p)
        size = os.path.getsize(p) if exists else 0
        info["model_pkl_search"][p] = {"exists": exists, "size_bytes": size}

    # 2. Check vector DB locations
    db_paths = [
        "./india_job_vector_db", "/app/india_job_vector_db", "india_job_vector_db"
    ]
    info["vector_db_search"] = {}
    for p in db_paths:
        exists = os.path.exists(p)
        is_dir = os.path.isdir(p) if exists else False
        contents = os.listdir(p) if is_dir else []
        info["vector_db_search"][p] = {"exists": exists, "is_dir": is_dir, "contents": contents}

    # 3. Check recommend_service status
    try:
        from app.services.recommend_service import recommend_service
        info["recommend_service"] = {
            "recommender_loaded": recommend_service.recommender is not None,
            "recommender_type": str(type(recommend_service.recommender)) if recommend_service.recommender else None,
        }
        if recommend_service.recommender:
            r = recommend_service.recommender
            info["recommend_service"]["db_path"] = getattr(r, 'db_path', 'N/A')
            info["recommend_service"]["model_name"] = getattr(r, 'model_name', 'N/A')
            info["recommend_service"]["collection_name"] = getattr(r, 'collection_name', 'N/A')
            info["recommend_service"]["has_model"] = hasattr(r, 'model') and r.model is not None
            info["recommend_service"]["has_collection"] = hasattr(r, 'collection') and r.collection is not None
            if hasattr(r, 'collection') and r.collection is not None:
                try:
                    info["recommend_service"]["collection_count"] = r.collection.count()
                except Exception as e:
                    info["recommend_service"]["collection_count_error"] = str(e)
    except Exception as e:
        info["recommend_service_error"] = str(e)

    # 4. Try a test prediction
    try:
        from app.services.recommend_service import recommend_service
        test_results = recommend_service.recommend_jobs("Python developer with React and Node.js")
        info["test_prediction"] = {
            "success": True,
            "num_results": len(test_results),
            "results": test_results[:3]  # Show first 3
        }
    except Exception as e:
        info["test_prediction"] = {
            "success": False,
            "error": str(e)
        }

    # 5. CWD and env
    info["cwd"] = os.getcwd()
    info["ls_cwd"] = os.listdir(".")[:20]

    return info
