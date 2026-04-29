from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import Any, Optional, List
from pydantic import BaseModel, Field
from uuid import UUID
import httpx

from app.core.auth import get_current_user
from app.core.db import get_db
from app.models.global_blacklist import GlobalBlacklist
from app.models.threat_log import ThreatLog
from app.models.project import Project
from app.models.user import User
from app.services import project as project_service
from app.schemas.threat_log import ThreatLog as ThreatLogSchema

router = APIRouter()


class TelemetrySchema(BaseModel):
    """Schema for incoming telemetry data from SDK"""
    ip: str
    dna: str
    path: str
    status: str
    factors: List[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    headers: Optional[dict[str, Any]] = None
    agent: Optional[str] = None
    trace_id: Optional[str] = None
    country: Optional[str] = None
    reason: Optional[str] = None


class BlacklistCheckSchema(BaseModel):
    dna: str


class BlacklistCheckResponse(BaseModel):
    blocked: bool
    dna: str
    reason: Optional[str] = None
    risk_factors: List[str] = Field(default_factory=list)


class RuntimeConfigResponse(BaseModel):
    hard_ban_enabled: bool


class PaginatedThreatsResponse(BaseModel):
    """Response schema for paginated threats"""
    threats: List[ThreatLogSchema]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_prev: bool


FACTOR_RISK_SCORES = {
    "global_blacklist_match": 100,
    "high_request_velocity": 30,
    "suspicious_user_agent": 20,
    "bait_path_triggered": 100,
    "unauthorized_access": 100,
    "repeat_offender_banned": 100,
}

BLACKLIST_TRIGGER_FACTORS = {
    "global_blacklist_match",
    "bait_path_triggered",
    "unauthorized_access",
    "repeat_offender_banned",
}

LEGACY_REASON_FACTORS = {
    "bait_path_access": "bait_path_triggered",
    "unauthorized_access": "unauthorized_access",
}


def calculate_risk_score(status: str, factors: list[str]) -> int:
    if not factors:
        fallback_scores = {
            "BANNED": 100,
            "LIMIT": 30,
            "OK": 0,
        }
        return fallback_scores.get(status, 50)

    total = sum(FACTOR_RISK_SCORES.get(factor, 0) for factor in factors)
    if total == 0:
        return calculate_risk_score(status, [])
    return min(total, 100)


def get_sdk_project_or_401(db: Session, api_key: Optional[str]) -> Project:
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-GuardFlow-Key header"
        )

    project = project_service.get_project_by_api_key(db, api_key=api_key)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key"
        )

    return project


def upsert_global_blacklist(
    db: Session,
    *,
    project: Project,
    threat_log: ThreatLog,
    factors: list[str],
) -> GlobalBlacklist:
    reason = next(
        (factor for factor in factors if factor in BLACKLIST_TRIGGER_FACTORS),
        "global_blacklist_match",
    )

    existing_entry = db.query(GlobalBlacklist).filter(GlobalBlacklist.dna_id == threat_log.dna_id).first()
    if existing_entry:
        existing_entry.risk_factors = list(dict.fromkeys([*(existing_entry.risk_factors or []), *factors]))
        existing_entry.reason = reason
        existing_entry.source_project_id = project.id
        existing_entry.source_threat_log_id = threat_log.id
        existing_entry.hit_count += 1
        existing_entry.last_seen_at = func.now()
        db.add(existing_entry)
        return existing_entry

    new_entry = GlobalBlacklist(
        dna_id=threat_log.dna_id,
        source_project_id=project.id,
        source_threat_log_id=threat_log.id,
        reason=reason,
        risk_factors=factors,
    )
    db.add(new_entry)
    return new_entry


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
    project = get_sdk_project_or_401(db, x_guardflow_key)
    
    # 2. Calculate risk score from the factors the SDK observed.
    factors = list(dict.fromkeys(payload.factors))
    if payload.reason and payload.reason not in factors:
        factors.append(LEGACY_REASON_FACTORS.get(payload.reason, payload.reason))

    risk_score = calculate_risk_score(payload.status, factors)
    
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
        risk_score=risk_score,
        risk_factors=factors,
        request_metadata=payload.metadata or payload.headers or {},
    )
    
    # 5. Save to database
    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    if risk_score >= 100 or any(factor in BLACKLIST_TRIGGER_FACTORS for factor in factors):
        upsert_global_blacklist(db, project=project, threat_log=new_log, factors=factors)
        db.commit()
    
    return {
        "status": "saved",
        "log_id": str(new_log.id),
        "project_id": str(project.id),
        "country": country
    }


@router.post("/telemetry/blacklist-check", response_model=BlacklistCheckResponse)
async def check_blacklist(
    payload: BlacklistCheckSchema,
    db: Session = Depends(get_db),
    x_guardflow_key: str = Header(None, alias="X-GuardFlow-Key")
):
    """
    Check whether a DNA fingerprint is globally blacklisted.
    """
    get_sdk_project_or_401(db, x_guardflow_key)

    entry = db.query(GlobalBlacklist).filter(GlobalBlacklist.dna_id == payload.dna).first()
    if not entry:
        return BlacklistCheckResponse(blocked=False, dna=payload.dna)

    return BlacklistCheckResponse(
        blocked=True,
        dna=payload.dna,
        reason=entry.reason,
        risk_factors=entry.risk_factors or [],
    )


@router.get("/telemetry/runtime-config", response_model=RuntimeConfigResponse)
async def get_runtime_config(
    db: Session = Depends(get_db),
    x_guardflow_key: str = Header(None, alias="X-GuardFlow-Key")
):
    """
    Return project-level control-plane configuration for the SDK.
    """
    project = get_sdk_project_or_401(db, x_guardflow_key)
    return RuntimeConfigResponse(hard_ban_enabled=project.hard_ban_enabled)


@router.get("/threats", response_model=PaginatedThreatsResponse)
async def get_threats(
    db: Session = Depends(get_db),
    project_id: UUID = None,
    limit: int = 20,
    skip: int = 0,
    current_user: User = Depends(get_current_user),
):
    """
    Get threat logs for a specific project with pagination
    
    Required:
    - project_id: The project to get threats for
    
    Optional:
    - limit: Maximum number of results per page (default 20, max 100)
    - skip: Number of results to skip for pagination (default 0)
    
    Returns paginated threats ordered by most recent first
    """
    
    if not project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="project_id is required"
        )
    
    # Limit the page size to prevent abuse
    limit = min(limit, 100)
    
    # Verify project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    if project.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access threats for your own projects"
        )
    
    # Get total count for pagination
    total_count = (
        db.query(ThreatLog)
        .filter(ThreatLog.project_id == project_id)
        .count()
    )
    
    # Get threats for this project
    threats = (
        db.query(ThreatLog)
        .filter(ThreatLog.project_id == project_id)
        .order_by(ThreatLog.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    # Calculate pagination metadata
    page = (skip // limit) + 1
    total_pages = (total_count + limit - 1) // limit  # Ceiling division
    has_next = skip + limit < total_count
    has_prev = skip > 0
    
    return PaginatedThreatsResponse(
        threats=threats,
        total=total_count,
        page=page,
        page_size=limit,
        total_pages=total_pages,
        has_next=has_next,
        has_prev=has_prev
    )
