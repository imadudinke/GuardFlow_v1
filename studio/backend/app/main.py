from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import asyncio
import httpx
import logging
from contextlib import asynccontextmanager

from app.api import api_router

# Setup logging
logger = logging.getLogger(__name__)

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


# Keep-alive task to prevent Render from sleeping
async def keep_alive_task():
    """
    Background task that pings the health endpoint every 10 minutes
    to keep the Render service active (prevents free tier sleep)
    """
    # Only run in production (Render deployment)
    if ENVIRONMENT != "production":
        logger.info("Keep-alive task disabled (not in production)")
        return
    
    # Wait 2 minutes before starting (let app fully initialize)
    await asyncio.sleep(120)
    
    # Get the service URL from environment or use default
    service_url = os.getenv("RENDER_EXTERNAL_URL", "https://guardflow-v1.onrender.com")
    
    logger.info(f"🔄 Keep-alive task started for {service_url}")
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        while True:
            try:
                # Ping the health endpoint
                response = await client.get(f"{service_url}/health")
                if response.status_code == 200:
                    logger.debug(f"✅ Keep-alive ping successful")
                else:
                    logger.warning(f"⚠️ Keep-alive ping returned {response.status_code}")
            except Exception as e:
                logger.error(f"❌ Keep-alive ping failed: {e}")
            
            # Wait 10 minutes before next ping (Render sleeps after 15 min of inactivity)
            await asyncio.sleep(600)  # 600 seconds = 10 minutes


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup: Start keep-alive task
    task = asyncio.create_task(keep_alive_task())
    logger.info("🚀 GuardFlow Studio API started")
    
    yield
    
    # Shutdown: Cancel keep-alive task
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass
    logger.info("🛑 GuardFlow Studio API stopped")


app = FastAPI(
    title="GuardFlow Studio API",
    description="API for GuardFlow threat monitoring platform",
    version="1.0.0",
    docs_url="/docs" if ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if ENVIRONMENT != "production" else None,
    lifespan=lifespan,
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
