from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.db import Base

class ThreatLog(Base):
    __tablename__ = "threat_logs"
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    ip_address = Column(String)
    dna_id = Column(String) # The Fingerprint
    path = Column(String)   # Where they attacked (e.g., /.env)
    risk_score = Column(Integer)
    created_at = Column(DateTime, default=func.now())
