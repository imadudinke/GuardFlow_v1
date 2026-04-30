import httpx
import asyncio
import logging

# Set logger to WARNING by default (only show important messages)
logger = logging.getLogger("guardflow")
logger.setLevel(logging.WARNING)

# To enable debug logs, set: logging.getLogger("guardflow").setLevel(logging.DEBUG)

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
                    timeout=5.0 # Increased timeout for cloud deployments
                )
                if response.status_code != 201:
                    logger.debug(f"📡 [GuardFlow] Dashboard rejected telemetry: {response.status_code} - {response.text[:100]}")
            except httpx.TimeoutException:
                # Timeout is expected sometimes - don't spam logs
                logger.debug(f"📡 [GuardFlow] Telemetry timeout (Studio may be slow)")
            except httpx.ConnectError:
                # Connection error - Studio might be down
                logger.debug(f"📡 [GuardFlow] Cannot connect to Studio at {self.studio_url}")
            except Exception as e:
                # Silent failure - The User App stays online no matter what
                logger.debug(f"📡 [GuardFlow] Telemetry error: {type(e).__name__}")

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
                    timeout=3.0,  # Increased timeout for cloud deployments
                )
                if response.status_code != 200:
                    logger.debug(f"📡 [GuardFlow] Blacklist check failed: {response.status_code}")
                    return None
                return response.json()
            except httpx.TimeoutException:
                # Timeout is expected - don't spam logs
                return None
            except httpx.ConnectError:
                # Connection error - Studio might be down
                return None
            except Exception as e:
                logger.debug(f"📡 [GuardFlow] Blacklist lookup error: {type(e).__name__}")
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
                    timeout=3.0,  # Increased timeout for cloud deployments
                )
                if response.status_code != 200:
                    logger.debug(f"📡 [GuardFlow] Runtime config fetch failed: {response.status_code}")
                    return None
                return response.json()
            except httpx.TimeoutException:
                # Timeout is expected - don't spam logs
                return None
            except httpx.ConnectError:
                # Connection error - Studio might be down
                return None
            except Exception as e:
                logger.debug(f"📡 [GuardFlow] Runtime config error: {type(e).__name__}")
                return None
