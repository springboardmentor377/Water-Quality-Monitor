#!/usr/bin/env python3
"""
Reset database and create test user
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

import sqlite3
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import User, UserRole
from auth import hash_password

def reset_database():
    """Reset database and create test user"""
    
    # Delete existing database
    db_path = os.path.join(os.path.dirname(__file__), 'backend', 'water_quality.db')
    if os.path.exists(db_path):
        os.remove(db_path)
        print("✓ Removed old database")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("✓ Created new database with correct schema")
    
    # Create session
    db = Session(engine)
    
    try:
        # Create test user
        test_user = User(
            email="admin@test.com",
            password=hash_password("admin123"),
            full_name="Test Admin",
            role=UserRole.ADMIN,
            is_active=True
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
    print("🔄 Resetting database...")
    reset_database()
