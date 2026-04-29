from datetime import datetime
from typing import Optional
from uuid import UUID
from app.schemas.base import BaseSchema, BaseDBSchema

class ThreatLogBase(BaseSchema):
    project_id: UUID
    ip_address: str
    dna_id: str
    path: str
    country: str
    risk_score: int


class ThreatLogCreate(ThreatLogBase):
    pass


class ThreatLogUpdate(BaseSchema):
    risk_score: Optional[int] = None


class ThreatLog(BaseDBSchema, ThreatLogBase):
    created_at: datetime
