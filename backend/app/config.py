import os

class Settings:
    PROJECT_NAME: str = "AquaOne Platform API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./aquaone.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "aquaone-hackathon-secret-key-2026")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()
