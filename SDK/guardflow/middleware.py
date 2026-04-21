"""
GuardFlow Middleware - The "Bouncer" logic
Intercepts requests and performs threat detection
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import uuid
import traceback

from .fingerprint import create_fingerprint


class GuardFlowMiddleware(BaseHTTPMiddleware):
    """
    HTTP middleware for threat detection and blocking
    """
    
    def __init__(self, app, api_key: str, redis_url: str = None):
        super().__init__(app)
        self.api_key = api_key
        self.redis_url = redis_url
        
        # Only initialize limiter if Redis URL is provided
        if redis_url:
            from .limiter import RateLimiter
            self.limiter = RateLimiter(redis_url)
        else:
            self.limiter = None
    
    async def dispatch(self, request: Request, call_next):
        """Process incoming request"""
        
        try:
            # 1. Capture DNA
            dna = create_fingerprint(dict(request.headers))
            
            # 2. Assign a Trace ID
            trace_id = f"gf_{uuid.uuid4().hex[:8]}"
            
            print(f"🛡️ [GuardFlow] DNA: {dna[:12]}... | Trace: {trace_id}")
            
            # 3. Check rate limiting if Redis is configured
            if self.limiter and self.limiter.is_rate_limited(dna, limit=10, window=60):
                return JSONResponse(
                    status_code=429,
                    content={
                        "error": "Too Many Requests",
                        "message": "Rate limit exceeded. Please try again later.",
                        "trace_id": trace_id
                    },
                    headers={"X-GuardFlow-Trace": trace_id}
                )
                
            # 4. Process request and add Trace ID to response
            response = await call_next(request)
            response.headers["X-GuardFlow-Trace"] = trace_id
            return response
            
        except Exception as e:
            # Catch any errors and return a proper response
            error_trace = f"gf_err_{uuid.uuid4().hex[:8]}"
            print(f"❌ [GuardFlow Error] {error_trace}: {str(e)}")
            print(traceback.format_exc())
            
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal Server Error",
                    "message": "GuardFlow middleware encountered an error",
                    "trace_id": error_trace
                },
                headers={"X-GuardFlow-Error": error_trace}
            )
