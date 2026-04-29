from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from uuid import UUID
import secrets
from datetime import datetime, timezone

from app.models.project import Project
from app.models.threat_log import ThreatLog
from app.schemas.project import ProjectCreate, ProjectUpdate


def generate_api_key() -> str:
    """Generate a unique API key with gf_live_ prefix"""
    random_key = secrets.token_urlsafe(32)
    return f"gf_live_{random_key}"


def get_project(db: Session, project_id: UUID) -> Optional[Project]:
    return db.query(Project).filter(Project.id == project_id).first()


def get_user_project(db: Session, project_id: UUID, user_id: UUID) -> Optional[Project]:
    return (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == user_id)
        .first()
    )


def get_project_by_api_key(db: Session, api_key: str) -> Optional[Project]:
    return db.query(Project).filter(Project.api_key == api_key).first()


def get_projects(db: Session, skip: int = 0, limit: int = 100) -> List[Project]:
    return db.query(Project).offset(skip).limit(limit).all()


def get_user_projects(db: Session, user_id: UUID, skip: int = 0, limit: int = 100) -> List[Project]:
    projects = db.query(Project).filter(Project.user_id == user_id).offset(skip).limit(limit).all()
    attach_project_stats(db, projects)
    return projects


def attach_project_stats(db: Session, projects: List[Project]) -> List[Project]:
    if not projects:
        return projects

    start_of_day = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    project_ids = [project.id for project in projects]
    blocked_counts = dict(
        db.query(ThreatLog.project_id, func.count(ThreatLog.id))
        .filter(
            ThreatLog.project_id.in_(project_ids),
            ThreatLog.created_at >= start_of_day,
            ThreatLog.risk_score >= 75,
        )
        .group_by(ThreatLog.project_id)
        .all()
    )

    for project in projects:
        setattr(project, "blocked_today", blocked_counts.get(project.id, 0))

    return projects


def create_project(db: Session, project: ProjectCreate) -> Project:
    api_key = generate_api_key()
    db_project = Project(
        name=project.name,
        user_id=project.user_id,
        api_key=api_key
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    setattr(db_project, "blocked_today", 0)
    return db_project


def update_project(db: Session, project_id: UUID, project: ProjectUpdate) -> Optional[Project]:
    db_project = get_project(db, project_id)
    if not db_project:
        return None
    
    update_data = project.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    attach_project_stats(db, [db_project])
    return db_project


def rotate_api_key(db: Session, project_id: UUID) -> Optional[Project]:
    db_project = get_project(db, project_id)
    if not db_project:
        return None

    db_project.api_key = generate_api_key()
    db.commit()
    db.refresh(db_project)
    attach_project_stats(db, [db_project])
    return db_project


def delete_project(db: Session, project_id: UUID) -> bool:
    db_project = get_project(db, project_id)
    if not db_project:
        return False
    db.delete(db_project)
    db.commit()
    return True
