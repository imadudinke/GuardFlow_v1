"""
GuardFlow Middleware - The "Bouncer" logic
Intercepts requests and performs threat detection
"""
from .limiter import RateLimiter
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import uuid

from .fingerprint import create_fingerprint


class GuardFlowMiddleware(BaseHTTPMiddleware):
    """
    HTTP middleware for threat detection and blocking
    """
    
    def __init__(self, app, api_key: str, redis_url: str = None):
        super().__init__(app)
        self.api_key = api_key
        self.redis_url = redis_url
        self.limiter = RateLimiter(redis_url) 
    
    async def dispatch(self, request: Request, call_next):
        """Process incoming request"""
        
        # 1. Capture DNA
        dna = create_fingerprint(dict(request.headers))
        
        # 2. Assign a Trace ID
        trace_id = f"gf_{uuid.uuid4().hex[:8]}"
        
        print(f"🛡️ [GuardFlow] DNA: {dna[:12]}... | Trace: {trace_id}")
        if self.limiter.is_rate_limited(dna, limit=10, window=60):
            from fastapi import HTTPException
            raise HTTPException(status_code=429, detail="Too Many Requests")
            
        # 3. Add Trace ID to the response (DX Layer)
        response = await call_next(request)
        response.headers["X-GuardFlow-Trace"] = trace_id
        return response
