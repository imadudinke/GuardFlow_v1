from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List
from uuid import UUID

from app.core.db import get_db
from app.schemas.project import Project, ProjectCreate, ProjectUpdate
from app.services import project as project_service
from app.services import user as user_service

router = APIRouter()


@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    """Create a new project"""
    try:
        # Verify user exists
        db_user = user_service.get_user(db, user_id=project.user_id)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return project_service.create_project(db=db, project=project)
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )


@router.get("/", response_model=List[Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all projects"""
    projects = project_service.get_projects(db, skip=skip, limit=limit)
    return projects


@router.get("/user/{user_id}", response_model=List[Project])
def read_user_projects(user_id: UUID, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all projects for a specific user"""
    db_user = user_service.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    projects = project_service.get_user_projects(db, user_id=user_id, skip=skip, limit=limit)
    return projects


@router.get("/{project_id}", response_model=Project)
def read_project(project_id: UUID, db: Session = Depends(get_db)):
    """Get a specific project by ID"""
    db_project = project_service.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return db_project


@router.patch("/{project_id}", response_model=Project)
def update_project(project_id: UUID, project: ProjectUpdate, db: Session = Depends(get_db)):
    """Update a project"""
    db_project = project_service.update_project(db, project_id=project_id, project=project)
    if db_project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return db_project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: UUID, db: Session = Depends(get_db)):
    """Delete a project"""
    success = project_service.delete_project(db, project_id=project_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return None
