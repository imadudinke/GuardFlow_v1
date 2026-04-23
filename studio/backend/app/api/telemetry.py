from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
import httpx

from app.core.db import get_db
from app.models.threat_log import ThreatLog
from app.services import project as project_service

router = APIRouter()


class TelemetrySchema(BaseModel):
    """Schema for incoming telemetry data from SDK"""
    ip: str
    dna: str
    path: str
    status: str
    agent: Optional[str] = None
    trace_id: Optional[str] = None
    country: Optional[str] = None


async def get_country_from_ip(ip: str) -> str:
    """
    Looks up the country of an IP address using ipinfo.io (reliable, production-ready service)
    """
    # Check if it's a private/local IP
    if ip.startswith(("127.", "10.", "192.168.", "172.")) or ip in ["localhost", "::1"]:
        return "Local"
    
    # Try ipinfo.io - most reliable service (50k requests/month free)
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://ipinfo.io/{ip}/json",
                timeout=5.0,
                headers={"Accept": "application/json"}
            )
            if response.status_code == 200:
                data = response.json()
                country = data.get("country")  # Returns country code like "US"
                
                # Convert country code to full name
                country_names = {
                    "US": "United States", "GB": "United Kingdom", "CA": "Canada",
                    "AU": "Australia", "DE": "Germany", "FR": "France", "IT": "Italy",
                    "ES": "Spain", "NL": "Netherlands", "SE": "Sweden", "NO": "Norway",
                    "DK": "Denmark", "FI": "Finland", "PL": "Poland", "RU": "Russia",
                    "CN": "China", "JP": "Japan", "KR": "South Korea", "IN": "India",
                    "BR": "Brazil", "MX": "Mexico", "AR": "Argentina", "CL": "Chile",
                    "ZA": "South Africa", "EG": "Egypt", "NG": "Nigeria", "KE": "Kenya",
                    "SG": "Singapore", "MY": "Malaysia", "TH": "Thailand", "ID": "Indonesia",
                    "PH": "Philippines", "VN": "Vietnam", "NZ": "New Zealand", "IE": "Ireland",
                    "CH": "Switzerland", "AT": "Austria", "BE": "Belgium", "PT": "Portugal",
                    "GR": "Greece", "TR": "Turkey", "IL": "Israel", "SA": "Saudi Arabia",
                    "AE": "United Arab Emirates", "PK": "Pakistan", "BD": "Bangladesh"
                }
                
                if country:
                    return country_names.get(country, country)  # Return full name or code
    except Exception as e:
        print(f"⚠️  [GuardFlow] ipinfo.io failed: {e}")
    
    # Fallback to ip-api.com
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"http://ip-api.com/json/{ip}?fields=status,country",
                timeout=3.0
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "success":
                    country = data.get("country")
                    if country:
                        return country
    except Exception as e:
        print(f"⚠️  [GuardFlow] ip-api.com failed: {e}")
    
    return "Unknown"

@router.post("/telemetry", status_code=status.HTTP_201_CREATED)
async def receive_telemetry(
    payload: TelemetrySchema,
    db: Session = Depends(get_db),
    x_guardflow_key: str = Header(None, alias="X-GuardFlow-Key")
):
    """
    Receive telemetry data from GuardFlow SDK
    
    Validates API key and stores threat logs in database
    """
    
    # 1. Verify API key exists in projects table
    if not x_guardflow_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-GuardFlow-Key header"
        )
    
    project = project_service.get_project_by_api_key(db, api_key=x_guardflow_key)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key"
        )
    
    # 2. Calculate risk score based on status
    risk_score_map = {
        "BANNED": 100,
        "LIMIT": 75,
        "OK": 0
    }
    risk_score = risk_score_map.get(payload.status, 50)
    
    # 3. Get country from payload or IP lookup
    country = payload.country
    if not country:
        country = await get_country_from_ip(payload.ip)
    
    # 4. Create threat log entry
    new_log = ThreatLog(
        project_id=project.id,
        ip_address=payload.ip,
        dna_id=payload.dna,
        path=payload.path,
        country=country,
        risk_score=risk_score
    )
    
    # 5. Save to database
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    
    return {
        "status": "saved",
        "log_id": str(new_log.id),
        "project_id": str(project.id),
        "country": country
    }
