from app.database import engine
from app.models import Base, Alert
from sqlalchemy import text
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def update_schema():
    print("Updating database schema...")
    
    with engine.connect() as conn:
        # 1. Check if 'alerts' table exists and needs recreation
        # Since we are in dev/demo mode, dropping and recreating alerts is safest 
        # to ensure it matches the new model exactly.
        try:
            print("Dropping 'alerts' table to ensure fresh schema...")
            conn.execute(text("DROP TABLE IF EXISTS alerts CASCADE"))
            conn.commit()
            print("'alerts' table dropped.")
        except Exception as e:
            print(f"Error dropping table: {e}")

        # 2. Check if 'ngo_projects' table exists (it shouldn't based on logs)
        # created via create_all below

    # 3. Create all tables (will create ngo_projects and recreate alerts)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")
    
if __name__ == "__main__":
    update_schema()
