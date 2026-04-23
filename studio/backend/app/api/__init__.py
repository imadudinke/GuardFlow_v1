from fastapi import APIRouter

from app.api import users, projects, telemetry

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(telemetry.router, tags=["telemetry"])
