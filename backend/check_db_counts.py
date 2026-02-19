from dotenv import load_dotenv
load_dotenv()

from app.database import SessionLocal
from app.models import Station, Report, Alert

def check_counts():
    db = SessionLocal()
    try:
        station_count = db.query(Station).count()
        report_count = db.query(Report).count()
        alert_count = db.query(Alert).count()
        
        print(f"Stations: {station_count}")
        print(f"Reports: {report_count}")
        print(f"Alerts: {alert_count}")
    finally:
        db.close()

if __name__ == "__main__":
    check_counts()
