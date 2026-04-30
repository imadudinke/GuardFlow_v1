import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'SDK')))

from fastapi import FastAPI
from guardflow.middleware import GuardFlowMiddleware

app = FastAPI()

app.add_middleware(
    GuardFlowMiddleware, 
    api_key="gf_live_s380vLEX3YBl7PH97TEKWN4NFew8TPhdCbUHWBxYaYM",
    redis_url="redis://localhost:6379",
    studio_url="https://guardflow-v1.onrender.com"
)

@app.get("/")
async def root():
    return {"status": "Protected"}
