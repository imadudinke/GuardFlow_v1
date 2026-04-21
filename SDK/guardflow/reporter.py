"""
Threat Reporter - The "Telemetry" logic
Reports threat data to GuardFlow API
"""

import httpx
from typing import Optional
import asyncio


class ThreatReporter:
    """
    Report threat events to GuardFlow Studio API
    """
    
    def __init__(self, api_key: str, api_url: str = "http://localhost:8001"):
        self.api_key = api_key
        self.api_url = api_url.rstrip("/")
    
    async def report_threat(
        self,
        ip_address: str,
        dna_id: str,
        path: str,
        risk_score: int,
        metadata: Optional[dict] = None
    ) -> bool:
        """
        Report a threat event to GuardFlow API
        
        Args:
            ip_address: Client IP address
            dna_id: Device fingerprint
            path: Requested path
            risk_score: Calculated risk score (0-100)
            metadata: Additional threat metadata
            
        Returns:
            True if reported successfully
        """
        # TODO: Implement API reporting
        # POST to /api/v1/threats with threat data
        
        payload = {
            "ip_address": ip_address,
            "dna_id": dna_id,
            "path": path,
            "risk_score": risk_score,
        }
        
        if metadata:
            payload["metadata"] = metadata
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/api/v1/threats",
                    json=payload,
                    headers={"X-API-Key": self.api_key},
                    timeout=5.0
                )
                return response.status_code == 201
        except Exception as e:
            # Log error but don't break the application
            print(f"Failed to report threat: {e}")
            return False
