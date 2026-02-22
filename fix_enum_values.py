#!/usr/bin/env python3
"""
Fix enum values in database
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

import sqlite3

def fix_enum_values():
    """Fix enum values to match model definitions"""
    
    db_path = os.path.join(os.path.dirname(__file__), 'backend', 'water_quality.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Update user role from lowercase to uppercase
        cursor.execute("UPDATE users SET role = 'ADMIN' WHERE role = 'admin'")
        cursor.execute("UPDATE users SET role = 'CITIZEN' WHERE role = 'citizen'")
        cursor.execute("UPDATE users SET role = 'NGO' WHERE role = 'ngo'")
        cursor.execute("UPDATE users SET role = 'AUTHORITY' WHERE role = 'authority'")
        
        # Check and update report status
        cursor.execute("UPDATE reports SET status = 'PENDING' WHERE status = 'pending'")
        cursor.execute("UPDATE reports SET status = 'VERIFIED' WHERE status = 'verified'")
        cursor.execute("UPDATE reports SET status = 'REJECTED' WHERE status = 'rejected'")
        
        conn.commit()
        print("✓ Enum values fixed successfully!")
        
        # Verify the fix
        cursor.execute("SELECT email, role FROM users")
        users = cursor.fetchall()
        print("Current users:")
        for user in users:
            print(f"  {user[0]}: {user[1]}")
        
    except Exception as e:
        print(f"✗ Error fixing enum values: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔧 Fixing enum values...")
    fix_enum_values()
