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
            
            # 3. Check rate limiting and ban status if Redis is configured
            if self.limiter:
                status = self.limiter.check_and_ban(dna, limit=10, ban_threshold=50)
                
                if status == "BANNED":
                    # Hard Block - Total Restriction
                    print(f"🚫 [GuardFlow] BANNED: {dna[:12]}... | Trace: {trace_id}")
                    return JSONResponse(
                        status_code=403,
                        content={
                            "error": "Access Denied",
                            "message": "Your identity has been banned for 1 hour.",
                            "trace_id": trace_id
                        },
                        headers={"X-GuardFlow-Trace": trace_id, "X-GuardFlow-Status": "BANNED"}
                    )
                
                if status == "LIMIT":
                    # Soft Block - Rate Limited
                    print(f"⚠️  [GuardFlow] RATE LIMITED: {dna[:12]}... | Trace: {trace_id}")
                    return JSONResponse(
                        status_code=429,
                        content={
                            "error": "Too Many Requests",
                            "message": "Rate limit exceeded. Please slow down.",
                            "trace_id": trace_id
                        },
                        headers={"X-GuardFlow-Trace": trace_id, "X-GuardFlow-Status": "LIMIT"}
                    )
                
            # 4. Process request and add Trace ID to response
            response = await call_next(request)
            response.headers["X-GuardFlow-Trace"] = trace_id
            response.headers["X-GuardFlow-Status"] = "OK"
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
