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
    Looks up the country of an IP address using ipapi.co (free, reliable service)
    """
    try:
        async with httpx.AsyncClient() as client:
            # Using ipapi.co - free tier allows 1000 requests/day
            response = await client.get(
                f"https://ipapi.co/{ip}/country_name/",
                timeout=3.0,
                headers={"User-Agent": "GuardFlow/1.0"}
            )
            if response.status_code == 200:
                country = response.text.strip()
                if country and country != "Undefined":
                    return country
    except Exception as e:
        print(f"⚠️  [GuardFlow] IP lookup failed: {e}")
    
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
