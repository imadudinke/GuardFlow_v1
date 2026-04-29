from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import uuid
import asyncio
import time
import traceback
from .reporter import TelemetryReporter
from .fingerprint import create_fingerprint
from .scrubber import scrub_metadata


class GuardFlowMiddleware(BaseHTTPMiddleware):
    DEFAULT_BAIT_PATHS = (
        "/admin",
        "/admin/",
        "/wp-admin",
        "/dashboard/admin",
        "/phpmyadmin",
        "/.env",
    )

    def __init__(
        self,
        app,
        api_key: str,
        redis_url: str,
        studio_url: str,
        bait_paths=None,
        protected_paths=None,
    ):
        super().__init__(app)
        self.api_key = api_key
        self.reporter = TelemetryReporter(api_key, studio_url)
        self.bait_paths = tuple(bait_paths or self.DEFAULT_BAIT_PATHS)
        self.protected_paths = tuple(protected_paths or ())
        self._runtime_config = {"hard_ban_enabled": True}
        self._runtime_config_checked_at = 0.0
        self._runtime_config_ttl_seconds = 15.0
        
        # Initialize Limiter
        from .limiter import RateLimiter
        self.limiter = RateLimiter(redis_url)

    @staticmethod
    def _append_factor(factors, factor: str):
        if factor and factor not in factors:
            factors.append(factor)

    def _matches_path_group(self, path: str, paths) -> bool:
        return any(path == protected_path or path.startswith(f"{protected_path}/") for protected_path in paths)

    def _has_auth_credentials(self, request: Request) -> bool:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.strip():
            scheme, _, token = auth_header.partition(" ")
            scheme = scheme.lower()
            token = token.strip()

            if scheme == "basic":
                return bool(token)

            if scheme == "bearer":
                # Treat obviously malformed bearer tokens as unauthenticated so
                # protected-path probes are blocked before they leak into app routes.
                return bool(token) and token.count(".") == 2

            return bool(token)

        cookie_names = ("access_token", "session", "sessionid", "jwt")
        return any(request.cookies.get(cookie_name) for cookie_name in cookie_names)

    def _build_risk_factors(self, request: Request, status: str, hits: int = 0, extra_factors=None):
        factors = list(extra_factors or [])
        user_agent = request.headers.get("user-agent", "").lower()

        if "python" in user_agent:
            self._append_factor(factors, "suspicious_user_agent")

        if hits > 10:
            self._append_factor(factors, "high_request_velocity")

        if status == "BANNED" and hits > 50:
            self._append_factor(factors, "repeat_offender_banned")

        return factors

    async def _resolve_shared_blacklist_factors(self, dna: str):
        if await self.limiter.is_globally_blacklisted(dna):
            return ["global_blacklist_match"]

        blacklist_result = await self.reporter.check_blacklist(dna)
        if not blacklist_result or not blacklist_result.get("blocked"):
            return []

        await self.limiter.cache_global_blacklist(dna, 3600)
        inherited_factors = blacklist_result.get("risk_factors") or []
        return list(dict.fromkeys(["global_blacklist_match", *inherited_factors]))

    async def _get_runtime_config(self):
        now = time.monotonic()
        if now - self._runtime_config_checked_at < self._runtime_config_ttl_seconds:
            return self._runtime_config

        runtime_config = await self.reporter.get_runtime_config()
        if runtime_config:
            self._runtime_config = {
                "hard_ban_enabled": runtime_config.get("hard_ban_enabled", True),
            }

        self._runtime_config_checked_at = now
        return self._runtime_config

    def _queue_telemetry(self, request: Request, dna: str, trace_id: str, status: str, factors=None):
        telemetry_data = {
            "ip": request.client.host,
            "dna": dna,
            "path": request.url.path,
            "status": status,
            "trace_id": trace_id,
            "factors": list(factors or []),
            "metadata": scrub_metadata(dict(request.headers)),
        }
        asyncio.create_task(self.reporter.send_report(telemetry_data))
    
    async def dispatch(self, request: Request, call_next):
        # Generate Trace ID early so it's available for logs/errors
        trace_id = f"gf_{uuid.uuid4().hex[:8]}"
        
        try:
            # 1. Capture DNA
            dna = create_fingerprint(dict(request.headers))
            runtime_config = await self._get_runtime_config()
            hard_ban_enabled = runtime_config.get("hard_ban_enabled", True)
            passive_factors = []

            shared_blacklist_factors = await self._resolve_shared_blacklist_factors(dna)
            if shared_blacklist_factors:
                factors = self._build_risk_factors(
                    request=request,
                    status="BANNED",
                    extra_factors=shared_blacklist_factors,
                )
                if hard_ban_enabled:
                    print(f"🚫 [GuardFlow] GLOBAL BLACKLIST BLOCK: {dna[:8]}... | Trace: {trace_id}")
                    self._queue_telemetry(
                        request=request,
                        dna=dna,
                        trace_id=trace_id,
                        status="BANNED",
                        factors=factors,
                    )
                    return JSONResponse(
                        status_code=403,
                        content={
                            "error": "Access Denied",
                            "message": "GuardFlow blocked a globally blacklisted fingerprint.",
                            "trace_id": trace_id,
                        },
                        headers={"X-GuardFlow-Trace": trace_id, "X-GuardFlow-Status": "BANNED"},
                    )
                passive_factors.extend(factors)

            # 2. Block bait paths before application routing leaks them as 404s.
            if self._matches_path_group(request.url.path, self.bait_paths):
                factors = self._build_risk_factors(
                    request=request,
                    status="BANNED",
                    extra_factors=["bait_path_triggered"],
                )
                if hard_ban_enabled:
                    print(f"🚫 [GuardFlow] BAIT PATH BLOCKED: {request.url.path} | Trace: {trace_id}")
                    self._queue_telemetry(
                        request=request,
                        dna=dna,
                        trace_id=trace_id,
                        status="BANNED",
                        factors=factors,
                    )
                    return JSONResponse(
                        status_code=403,
                        content={
                            "error": "Access Denied",
                            "message": "GuardFlow blocked access to a protected bait path.",
                            "trace_id": trace_id,
                        },
                        headers={"X-GuardFlow-Trace": trace_id, "X-GuardFlow-Status": "BANNED"},
                    )
                passive_factors.extend(factors)

            if self._matches_path_group(request.url.path, self.protected_paths) and not self._has_auth_credentials(request):
                factors = self._build_risk_factors(
                    request=request,
                    status="BANNED",
                    extra_factors=["unauthorized_access"],
                )
                if hard_ban_enabled:
                    print(f"🚫 [GuardFlow] PROTECTED PATH BLOCKED: {request.url.path} | Trace: {trace_id}")
                    self._queue_telemetry(
                        request=request,
                        dna=dna,
                        trace_id=trace_id,
                        status="BANNED",
                        factors=factors,
                    )
                    return JSONResponse(
                        status_code=403,
                        content={
                            "error": "Access Denied",
                            "message": "GuardFlow blocked unauthorized access to a protected path.",
                            "trace_id": trace_id,
                        },
                        headers={"X-GuardFlow-Trace": trace_id, "X-GuardFlow-Status": "BANNED"},
                    )
                passive_factors.extend(factors)
            
            # 3. Check Security Status (MUST AWAIT because we use async redis)
            status = await self.limiter.check_and_ban(dna)
            hits = await self.limiter.get_hits(dna)
            factors = self._build_risk_factors(request=request, status=status, hits=hits)
            all_factors = list(dict.fromkeys([*passive_factors, *factors]))
            
            # 4. Telemetry Logic (Fire and Forget)
            telemetry_status = status
            if not hard_ban_enabled and (status != "OK" or all_factors):
                telemetry_status = "MONITOR"

            if telemetry_status != "OK" or all_factors:
                self._queue_telemetry(
                    request=request,
                    dna=dna,
                    trace_id=trace_id,
                    status=telemetry_status,
                    factors=all_factors,
                )

            # 5. Handle Decisions
            if hard_ban_enabled and status == "BANNED":
                print(f"🚫 [GuardFlow] BANNED: {dna[:8]}... | Trace: {trace_id}")
                return JSONResponse(
                    status_code=403,
                    content={"error": "Access Denied", "message": "Banned for 1 hour.", "trace_id": trace_id},
                    headers={"X-GuardFlow-Trace": trace_id, "X-GuardFlow-Status": "BANNED"}
                )
            
            if hard_ban_enabled and status == "LIMIT":
                print(f"⚠️ [GuardFlow] LIMIT: {dna[:8]}... | Trace: {trace_id}")
                return JSONResponse(
                    status_code=429,
                    content={"error": "Too Many Requests", "trace_id": trace_id},
                    headers={"X-GuardFlow-Trace": trace_id, "X-GuardFlow-Status": "LIMIT"}
                )

            # 6. Success Path
            print(f"🛡️ [GuardFlow] DNA: {dna[:8]}... | Trace: {trace_id}")
            response = await call_next(request)
            response.headers["X-GuardFlow-Trace"] = trace_id
            response.headers["X-GuardFlow-Status"] = "OK"
            return response
            
        except Exception as e:
            # FAIL-OPEN: If GuardFlow crashes, let the request through
            # This ensures the business stays online even if security fails
            print(f"⚠️ [GuardFlow] SDK Error: {e}. Falling open for safety.")
            print(f"⚠️ [GuardFlow] Trace: {trace_id} | Error Details: {traceback.format_exc()}")
            
            # Let the request through so the business doesn't stop
            response = await call_next(request)
            response.headers["X-GuardFlow-Trace"] = trace_id
            response.headers["X-GuardFlow-Status"] = "FAIL-OPEN"
            return response
