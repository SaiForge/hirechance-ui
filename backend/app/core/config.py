import os
from typing import List, Dict, Any

def _get_env_str(key: str, default: str = "") -> str:
    val = os.getenv(key, default)
    return val.strip() if val else ""

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "HireChance Core & Recommendation API")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")

    # Cloud / Supabase Credentials
    SUPABASE_DATABASE_URL: str = _get_env_str("SUPABASE_DATABASE_URL")
    SUPABASE_HOST: str = _get_env_str("SUPABASE_HOST")
    SUPABASE_USER: str = _get_env_str("SUPABASE_USER")
    SUPABASE_PASSWORD: str = _get_env_str("SUPABASE_PASSWORD")
    SUPABASE_DB: str = _get_env_str("SUPABASE_DB", "postgres")
    SUPABASE_PORT: int = int(os.getenv("SUPABASE_PORT", "5432"))
    
    SUPABASE_URL: str = _get_env_str("SUPABASE_URL")
    SUPABASE_KEY: str = _get_env_str("SUPABASE_KEY", _get_env_str("SUPABASE_ANON_KEY"))

    # Standard Database settings
    DATABASE_URL: str = _get_env_str("DATABASE_URL")
    POSTGRES_USER: str = _get_env_str("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = _get_env_str("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = _get_env_str("POSTGRES_DB", "placement_db")
    POSTGRES_HOST: str = _get_env_str("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", "5432"))

    # Security & JWT settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "supersecretkeythatyoushouldchangeinproduction")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    # CORS & Server settings
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,http://localhost:8001")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    @property
    def is_supabase(self) -> bool:
        """Check if Supabase credentials or host are provided."""
        url = self.database_url.lower()
        return (
            "supabase" in url or 
            bool(self.SUPABASE_DATABASE_URL) or 
            bool(self.SUPABASE_HOST) or
            bool(self.SUPABASE_URL)
        )

    @property
    def database_url(self) -> str:
        """
        Smart Database URL Resolution:
        1. Explicit SUPABASE_DATABASE_URL (if provided)
        2. Explicit DATABASE_URL (if provided)
        3. Built from SUPABASE_HOST component credentials (if provided)
        4. Local Machine / Docker fallback (postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB})
        """
        if self.SUPABASE_DATABASE_URL:
            url = self.SUPABASE_DATABASE_URL
        elif self.DATABASE_URL:
            url = self.DATABASE_URL
        elif self.SUPABASE_HOST and self.SUPABASE_PASSWORD:
            user = self.SUPABASE_USER or "postgres"
            db = self.SUPABASE_DB or "postgres"
            url = f"postgresql://{user}:{self.SUPABASE_PASSWORD}@{self.SUPABASE_HOST}:{self.SUPABASE_PORT}/{db}"
        else:
            url = f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

        # Normalize postgres:// -> postgresql:// for SQLAlchemy compatibility
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    @property
    def database_engine_args(self) -> Dict[str, Any]:
        """
        Engine parameters for SQLAlchemy:
        Enables SSL mode if connecting to Supabase or cloud Postgres.
        """
        args: Dict[str, Any] = {}
        sslmode = os.getenv("DB_SSLMODE", "").lower()
        url = self.database_url.lower()

        if sslmode == "require" or "supabase" in url or "azure" in url:
            args["connect_args"] = {"sslmode": "require"}
        return args

    @property
    def cors_origins(self) -> List[str]:
        if not self.ALLOWED_ORIGINS:
            return ["*"]
        if self.ALLOWED_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

settings = Settings()
