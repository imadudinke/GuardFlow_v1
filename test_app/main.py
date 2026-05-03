import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'SDK')))

from fastapi import FastAPI
from guardflow.middleware import GuardFlowMiddleware

app = FastAPI()

app.add_middleware(
    GuardFlowMiddleware, 
    api_key="gf_live_GOCWPA4TK_WE2WAi9HZ4rH7vdTjeDLcbHkt6_-jb4_M",
    redis_url="redis://localhost:6379",
    studio_url="http://localhost:8001"
)

@app.get("/")
async def root():
    return {"status": "Protected"}
