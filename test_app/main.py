import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'SDK')))

from fastapi import FastAPI
from guardflow.middleware import GuardFlowMiddleware

app = FastAPI()

app.add_middleware(
    GuardFlowMiddleware, 
    api_key="gf_live_oj3ScmeqXefHZjggaGt0abA5iNIqcivi6GphL1MiIfU",
    redis_url="redis://localhost:6379",
    studio_url="http://127.0.0.1:8001"
)

@app.get("/")
async def root():
    return {"status": "Protected"}
