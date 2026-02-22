#!/usr/bin/env python3
"""
Add missing columns to existing database
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

import sqlite3

def add_missing_columns():
    """Add missing columns to existing database"""
    
    db_path = os.path.join(os.path.dirname(__file__), 'backend', 'water_quality.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if updated_at column exists in users table
        cursor.execute("PRAGMA table_info(users)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        if 'updated_at' not in column_names:
            print("Adding updated_at column to users table...")
            cursor.execute("ALTER TABLE users ADD COLUMN updated_at DATETIME")
        
        # Check if verified_by column exists in reports table
        cursor.execute("PRAGMA table_info(reports)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        if 'verified_by' not in column_names:
            print("Adding verified_by column to reports table...")
            cursor.execute("ALTER TABLE reports ADD COLUMN verified_by INTEGER")
        
        if 'review_note' not in column_names:
            print("Adding review_note column to reports table...")
            cursor.execute("ALTER TABLE reports ADD COLUMN review_note TEXT")
        
        conn.commit()
        print("✓ Database schema updated successfully!")
        
    except Exception as e:
        print(f"✗ Error updating database: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔧 Updating database schema...")
    add_missing_columns()
