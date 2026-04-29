import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'SDK')))

from fastapi import FastAPI
from guardflow.middleware import GuardFlowMiddleware

app = FastAPI()

app.add_middleware(
    GuardFlowMiddleware, 
    api_key="gf_live_KvZjlrcu2Z6sKVfcE3s4EaFoVpK1bovk-B6Af1BwY-E",
    redis_url="redis://localhost:6379",
    studio_url="http://localhost:8001"
)

@app.get("/")
async def root():
    return {"status": "Protected"}
