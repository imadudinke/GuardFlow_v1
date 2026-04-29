from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid

from app.core.db import Base


class GlobalBlacklist(Base):
    __tablename__ = "global_blacklist"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dna_id = Column(String, nullable=False, unique=True, index=True)
    source_project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=True)
    source_threat_log_id = Column(UUID(as_uuid=True), ForeignKey("threat_logs.id"), nullable=True)
    reason = Column(String, nullable=False, default="shared_blacklist_match")
    risk_factors = Column(JSONB, nullable=False, default=list)
    hit_count = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    last_seen_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
