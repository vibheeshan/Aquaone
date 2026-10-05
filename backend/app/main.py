from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.api.routes import router as api_router
from app.seed import seed_database
import os

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow local frontend Next.js app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # Ensure database tables exist
    Base.metadata.create_all(bind=engine)
    # Check if database needs initial seeding
    db_file = "./aquaone.db"
    if os.path.exists(db_file) and os.path.getsize(db_file) < 5000:
        print("Initializing empty database with demo data...")
        seed_database()

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": "AquaOne - AI-Powered Citizen Stream & One Health Intelligence Platform",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }
