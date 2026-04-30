from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api import api_router

# Environment configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")


def _parse_cors_origins(raw_origins: str | None) -> list[str]:
    if not raw_origins:
        return []

    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


CORS_ORIGINS = _parse_cors_origins(os.getenv("CORS_ORIGINS"))

# Credentials-based auth requires explicit origins (not "*").
if not CORS_ORIGINS:
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

app = FastAPI(
    title="GuardFlow Studio API",
    description="API for GuardFlow threat monitoring platform",
    version="1.0.0",
    docs_url="/docs" if ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if ENVIRONMENT != "production" else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "message": "GuardFlow Studio API",
        "version": "1.0.0",
        "environment": ENVIRONMENT
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "environment": ENVIRONMENT
    }
