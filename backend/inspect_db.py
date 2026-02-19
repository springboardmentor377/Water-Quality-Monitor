from dotenv import load_dotenv
load_dotenv()

from app.database import engine, SessionLocal
from sqlalchemy import text, func
from app.models import Alert
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def inspect_db():
    print("Inspecting database...")
    
    with engine.connect() as conn:
        # Check columns in alerts table
        print("\nChecking 'alerts' table columns:")
        try:
            # PostgreSQL specific query to list columns
            result = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'alerts';"))
            columns = result.fetchall()
            for col in columns:
                print(f" - {col[0]} ({col[1]})")
                
            # SQLite fallback (if user switched or something)
            if not columns:
                result = conn.execute(text("PRAGMA table_info(alerts);"))
                columns = result.fetchall()
                for col in columns:
                    print(f" - {col[1]} ({col[2]})")
                    
        except Exception as e:
            print(f"Error checking columns: {e}")

    # Test the problematic query
    print("\nTesting dashboard query...")
    db = SessionLocal()
    try:
        alert_status_counts = db.query(Alert.status, func.count(Alert.status)).group_by(Alert.status).all()
        print(f"Query successful! Results: {alert_status_counts}")
    except Exception as e:
        print(f"Query FAILED: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    inspect_db()
