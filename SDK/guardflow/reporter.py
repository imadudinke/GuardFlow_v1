import httpx
import asyncio
import logging

logger = logging.getLogger("guardflow")

class TelemetryReporter:
    def __init__(self, api_key: str, studio_url: str):
        self.api_key = api_key
        # Ensure we point to the correct internal Docker or Local URL
        self.studio_url = f"{studio_url.rstrip('/')}/api/v1/telemetry"

    async def send_report(self, payload: dict):
        """
        Background task to ship threat data to the Studio.
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.studio_url,
                    json=payload,
                    headers={
                        "X-GuardFlow-Key": self.api_key,
                        "Content-Type": "application/json"
                    },
                    timeout=2.0 # Don't hang the app if Studio is slow
                )
                if response.status_code != 201:
                    logger.warning(f"📡 [GuardFlow] Dashboard rejected telemetry: {response.status_code}")
            except Exception as e:
                # Silent failure - The User App stays online no matter what
                logger.error(f"📡 [GuardFlow] Telemetry Transport Error: {e}")
