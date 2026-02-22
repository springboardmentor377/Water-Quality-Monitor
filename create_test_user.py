#!/usr/bin/env python3
"""
Create test user for development
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import User, UserRole
from auth import hash_password

def create_test_user():
    """Create a test user for development"""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    db = Session(engine)
    
    try:
        # Check if test user already exists
        existing_user = db.query(User).filter(User.email == "admin@test.com").first()
        if existing_user:
            print("✓ Test user already exists")
            print("Email: admin@test.com")
            print("Password: admin123")
            return
        
        # Create test user
        test_user = User(
            email="admin@test.com",
            password=hash_password("admin123"),
            name="Test Admin",
            role=UserRole.ADMIN
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("✓ Test user created successfully!")
        print("Email: admin@test.com")
        print("Password: admin123")
        print("Role: Admin")
        
    except Exception as e:
        print(f"✗ Error creating test user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Creating test user...")
    create_test_user()
