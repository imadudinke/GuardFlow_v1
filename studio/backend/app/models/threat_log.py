from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.core.db import Base

class ThreatLog(Base):
    __tablename__ = "threat_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    ip_address = Column(String)
    dna_id = Column(String) 
    path = Column(String)   
    country = Column(String, nullable=False, default="Unknown")  
    risk_score = Column(Integer)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
