import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'SDK')))

from fastapi import FastAPI
from guardflow.middleware import GuardFlowMiddleware

app = FastAPI()

app.add_middleware(
    GuardFlowMiddleware, 
    api_key="gf_live_Y8YdIkMfhxD4PD2ZQ6431YPUp6_OQvDnLmUlqd92yFc",
    redis_url="redis://localhost:6379",
    studio_url="https://guardflow-v1.onrender.com"
)

@app.get("/")
async def root():
    return {"status": "Protected"}
