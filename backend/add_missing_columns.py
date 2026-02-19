from app.database import engine
from sqlalchemy import text
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def add_missing_columns():
    print("Checking and adding missing columns...")
    
    with engine.connect() as conn:
        # 1. Add 'status' column to 'alerts' table
        try:
            print("Attempting to add 'status' column to 'alerts' table...")
            # Using standard SQL that works for both PostgreSQL and SQLite (mostly)
            # For PostgreSQL: ALTER TABLE alerts ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'active'
            # For SQLite: ALTER TABLE alerts ADD COLUMN status VARCHAR DEFAULT 'active' (IF NOT EXISTS is not supported in older versions)
            
            # Since the error log explicitly mentions psycopg2, we are using PostgreSQL.
            conn.execute(text("ALTER TABLE alerts ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'active'"))
            conn.commit()
            print("'status' column added/verified in 'alerts' table.")
        except Exception as e:
            print(f"Error adding 'status' column to 'alerts': {e}")
            
if __name__ == "__main__":
    add_missing_columns()
