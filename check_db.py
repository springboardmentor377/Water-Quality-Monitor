#!/usr/bin/env python3
"""
Check database schema and create test user accordingly
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

import sqlite3
from sqlalchemy.orm import Session
from database import engine, Base
from auth import hash_password

def check_and_create_user():
    """Check database schema and create test user"""
    
    # Check database schema
    db_path = os.path.join(os.path.dirname(__file__), 'backend', 'water_quality.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    print("Current users table columns:")
    for col in columns:
        print(f"  {col[1]} ({col[2]})")
    conn.close()
    
    # Try to create user using raw SQL
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE email = ?", ("admin@test.com",))
        if cursor.fetchone():
            print("✓ Test user already exists")
            print("Email: admin@test.com")
            print("Password: admin123")
            return
        
        # Insert user
        hashed_password = hash_password("admin123")
        cursor.execute("""
            INSERT INTO users (email, password, name, role) 
            VALUES (?, ?, ?, ?)
        """, ("admin@test.com", hashed_password, "Test Admin", "admin"))
        
        conn.commit()
        print("✓ Test user created successfully!")
        print("Email: admin@test.com")
        print("Password: admin123")
        print("Role: Admin")
        
    except Exception as e:
        print(f"✗ Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔍 Checking database schema...")
    check_and_create_user()
