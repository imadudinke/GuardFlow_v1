from datetime import datetime
from typing import Any, Optional
from uuid import UUID
from pydantic import Field
from app.schemas.base import BaseSchema, BaseDBSchema

class ThreatLogBase(BaseSchema):
    project_id: UUID
    ip_address: str
    dna_id: str
    path: str
    country: str
    risk_score: int
    risk_factors: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="request_metadata")


class ThreatLogCreate(ThreatLogBase):
    pass


class ThreatLogUpdate(BaseSchema):
    risk_score: Optional[int] = None
    risk_factors: Optional[list[str]] = None
    metadata: Optional[dict[str, Any]] = None


class ThreatLog(BaseDBSchema, ThreatLogBase):
    created_at: datetime
