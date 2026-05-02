from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import asyncio
import httpx
import logging
from contextlib import asynccontextmanager

from app.api import api_router

logger = logging.getLogger(__name__)
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")


def _parse_cors_origins(raw_origins: str | None) -> list[str]:
    if not raw_origins:
        return []

    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


CORS_ORIGINS = _parse_cors_origins(os.getenv("CORS_ORIGINS"))

if not CORS_ORIGINS:
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]


async def keep_alive_task():
    if ENVIRONMENT != "production":
        logger.info("Keep-alive task disabled")
        return

    await asyncio.sleep(120)

    service_url = os.getenv("RENDER_EXTERNAL_URL", "https://guardflow-v1.onrender.com")
    logger.info("Keep-alive task started for %s", service_url)

    async with httpx.AsyncClient(timeout=10.0) as client:
        while True:
            try:
                response = await client.get(f"{service_url}/health")
                if response.status_code == 200:
                    logger.debug("Keep-alive ping successful")
                else:
                    logger.warning("Keep-alive ping returned %s", response.status_code)
            except Exception as e:
                logger.error("Keep-alive ping failed: %s", e)

            await asyncio.sleep(600)


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(keep_alive_task())
    logger.info("GuardFlow Studio API started")

    yield

    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass
    logger.info("GuardFlow Studio API stopped")


app = FastAPI(
    title="GuardFlow Studio API",
    description="API for GuardFlow threat monitoring platform",
    version="1.0.0",
    docs_url="/docs" if ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if ENVIRONMENT != "production" else None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
