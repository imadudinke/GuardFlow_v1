from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import uuid
import asyncio
import traceback
from .reporter import TelemetryReporter
from .fingerprint import create_fingerprint

class GuardFlowMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, api_key: str, redis_url: str, studio_url: str):
        super().__init__(app)
        self.api_key = api_key
        self.reporter = TelemetryReporter(api_key, studio_url)
        
        # Initialize Limiter
        from .limiter import RateLimiter
        self.limiter = RateLimiter(redis_url)
    
    async def dispatch(self, request: Request, call_next):
        # Generate Trace ID early so it's available for logs/errors
        trace_id = f"gf_{uuid.uuid4().hex[:8]}"
        
        try:
            # 1. Capture DNA
            dna = create_fingerprint(dict(request.headers))
            
            # 2. Check Security Status (MUST AWAIT because we use async redis)
            status = await self.limiter.check_and_ban(dna)
            
            # 3. Telemetry Logic (Fire and Forget)
            if status != "OK":
                telemetry_data = {
                    "ip": request.client.host,
                    "dna": dna,
                    "path": request.url.path,
                    "status": status,
                    "agent": request.headers.get("user-agent"),
                    "trace_id": trace_id
                }
                # asyncio.create_task makes this non-blocking
                asyncio.create_task(self.reporter.send_report(telemetry_data))

            # 4. Handle Decisions
            if status == "BANNED":
                print(f"🚫 [GuardFlow] BANNED: {dna[:8]}... | Trace: {trace_id}")
                return JSONResponse(
                    status_code=403,
                    content={"error": "Access Denied", "message": "Banned for 1 hour.", "trace_id": trace_id},
                    headers={"X-GuardFlow-Trace": trace_id, "X-GuardFlow-Status": "BANNED"}
                )
            
            if status == "LIMIT":
                print(f"⚠️ [GuardFlow] LIMIT: {dna[:8]}... | Trace: {trace_id}")
                return JSONResponse(
                    status_code=429,
                    content={"error": "Too Many Requests", "trace_id": trace_id},
                    headers={"X-GuardFlow-Trace": trace_id, "X-GuardFlow-Status": "LIMIT"}
                )

            # 5. Success Path
            print(f"🛡️ [GuardFlow] DNA: {dna[:8]}... | Trace: {trace_id}")
            response = await call_next(request)
            response.headers["X-GuardFlow-Trace"] = trace_id
            response.headers["X-GuardFlow-Status"] = "OK"
            return response
            
        except Exception as e:
            print(f"❌ [GuardFlow Fail-Open] Error: {str(e)}")
            return await call_next(request)
