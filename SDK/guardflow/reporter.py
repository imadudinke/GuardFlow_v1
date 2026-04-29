import httpx
import asyncio
import logging

logger = logging.getLogger("guardflow")

class TelemetryReporter:
    def __init__(self, api_key: str, studio_url: str):
        self.api_key = api_key
        # Ensure we point to the correct internal Docker or Local URL
        base_url = studio_url.rstrip("/")
        self.studio_url = f"{base_url}/api/v1/telemetry"
        self.blacklist_url = f"{base_url}/api/v1/telemetry/blacklist-check"
        self.runtime_config_url = f"{base_url}/api/v1/telemetry/runtime-config"

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

    async def check_blacklist(self, dna: str) -> dict | None:
        """
        Check whether Studio already knows this DNA as a shared attacker.
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.blacklist_url,
                    json={"dna": dna},
                    headers={
                        "X-GuardFlow-Key": self.api_key,
                        "Content-Type": "application/json",
                    },
                    timeout=1.0,
                )
                if response.status_code != 200:
                    logger.warning(f"📡 [GuardFlow] Blacklist check failed: {response.status_code}")
                    return None
                return response.json()
            except Exception as e:
                logger.error(f"📡 [GuardFlow] Blacklist Lookup Error: {e}")
                return None

    async def get_runtime_config(self) -> dict | None:
        """
        Fetch project-level control-plane configuration from Studio.
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    self.runtime_config_url,
                    headers={
                        "X-GuardFlow-Key": self.api_key,
                        "Content-Type": "application/json",
                    },
                    timeout=1.0,
                )
                if response.status_code != 200:
                    logger.warning(f"📡 [GuardFlow] Runtime config fetch failed: {response.status_code}")
                    return None
                return response.json()
            except Exception as e:
                logger.error(f"📡 [GuardFlow] Runtime Config Error: {e}")
                return None
