"""
Script to create a project with your API key in the database
Run this on your Studio backend (Render shell or local backend)
"""
import sys
import os

# Add the backend path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'studio', 'backend')))

from app.core.db import SessionLocal
from app.models.project import Project
from app.models.user import User
import uuid

def create_project_with_api_key():
    db = SessionLocal()
    
    try:
        # Get the first user (or create one if needed)
        user = db.query(User).first()
        
        if not user:
            print("❌ No users found in database. Please create a user first.")
            print("   Go to https://guardflow-v1.onrender.com and register")
            return
        
        # Check if project with this API key already exists
        api_key = "gf_live_s380vLEX3YBl7PH97TEKWN4NFew8TPhdCbUHWBxYaYM"
        existing = db.query(Project).filter(Project.api_key == api_key).first()
        
        if existing:
            print(f"✅ Project already exists!")
            print(f"   Project ID: {existing.id}")
            print(f"   Project Name: {existing.name}")
            print(f"   API Key: {existing.api_key}")
            return
        
        # Create new project
        project = Project(
            id=str(uuid.uuid4()),
            name="Test Project",
            api_key=api_key,
            user_id=user.id,
            rate_limit=100,
            rate_window=60,
            enable_fingerprinting=True,
            enable_rate_limiting=True,
            enable_pii_scrubbing=True,
            honeypot_paths=["/admin", "/wp-admin", "/.env", "/config"]
        )
        
        db.add(project)
        db.commit()
        db.refresh(project)
        
        print("=" * 60)
        print("✅ PROJECT CREATED SUCCESSFULLY!")
        print("=" * 60)
        print(f"Project ID: {project.id}")
        print(f"Project Name: {project.name}")
        print(f"API Key: {project.api_key}")
        print(f"User ID: {project.user_id}")
        print(f"Rate Limit: {project.rate_limit} requests per {project.rate_window}s")
        print("=" * 60)
        print("\nYou can now test your FastAPI app:")
        print("1. uvicorn test_app.main:app --reload")
        print("2. curl http://localhost:8000/")
        print("3. Check Studio: https://guardflow-v1.onrender.com")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_project_with_api_key()
