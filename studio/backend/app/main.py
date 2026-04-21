from fastapi import FastAPI
# from app.api.v1 import projects, telemetry  # We will build these next
from app.core.db import engine, Base

app = FastAPI(title="GuardFlow Studio API")

# app.include_router(projects.router, prefix="/api/v1/projects", tags=["Projects"])
# app.include_router(telemetry.router, prefix="/api/v1/telemetry", tags=["Security"])

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "GuardFlow Studio",
        "version": "0.1.0"
    }

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)