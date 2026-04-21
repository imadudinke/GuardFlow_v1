from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.core.db import Base

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    api_key = Column(String, unique=True, index=True) # The "gf_live_..." key
    user_id = Column(Integer, ForeignKey("users.id"))
