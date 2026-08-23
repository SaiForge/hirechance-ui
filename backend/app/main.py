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


@app.on_event("startup")
def on_startup():
    try:
        Base.metadata.create_all(bind=engine)
        print("[Startup] Database tables verified / created successfully.")
    except Exception as e:
        print(f"[Startup] Warning: Could not connect to database on startup: {e}")

    # Warm up ML model in background thread so it is ready immediately for user requests
    import threading
    from app.services.recommend_service import recommend_service
    threading.Thread(target=recommend_service._load_model, daemon=True).start()


@app.get("/health")
def health_check():
    db_status = "unconnected"
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status
    }
