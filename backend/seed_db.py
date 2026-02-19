from dotenv import load_dotenv
load_dotenv()

from app.database import SessionLocal, engine
from app.models import Station, Report, Alert, Base
import logging
from sqlalchemy import text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Real Government Stations List (Source: Stationmap.jsx)
GOVERMENT_STATIONS = [
  {
    "station_id": "11819",
    "station_name": "BH72_River Ganga at Chausa, U/s of Buxar ",
    "station_latitude": "25.5193",
    "station_longitude": "83.9007"
  },
  {
    "station_id": "11804",
    "station_name": "BH73_Bridge on Ghagra near Manjhi, Chappra",
    "station_latitude": "25.8232",
    "station_longitude": "84.5858"
  },
  {
    "station_id": "11805",
    "station_name": "BH74_Road bridge on River Ganga, D/s of Buxar",
    "station_latitude": "25.5918",
    "station_longitude": "83.9861"
  },
  {
    "station_id": "11822",
    "station_name": "BH75_D/s of Bhagalpur, Road Bridge on River Ganga",
    "station_latitude": "25.30783",
    "station_longitude": "87.016618"
  },
  {
    "station_id": "11806",
    "station_name": "BH76_Road bridge at Fathua on Punpun, Patna",
    "station_latitude": "25.51046",
    "station_longitude": "85.30732"
  },
  {
    "station_id": "11807",
    "station_name": "BH77_New Bridge, U/s of Patna city, Khurji",
    "station_latitude": "25.6533",
    "station_longitude": "85.0952"
  },
  {
    "station_id": "11808",
    "station_name": "BH78_Road bridge on Burhi Gandak, Khagaria",
    "station_latitude": "25.501",
    "station_longitude": "86.4812"
  },
  {
    "station_id": "11809",
    "station_name": "BH79_Road bridge on Kosi, Kursela",
    "station_latitude": "25.4238",
    "station_longitude": "87.2336"
  },
  {
    "station_id": "11810",
    "station_name": "BH80_Road bridge on Son, Arrah",
    "station_latitude": "25.5672",
    "station_longitude": "84.7961"
  },
  {
    "station_id": "11811",
    "station_name": "BH81_Road Bridge on Gandak, Hajipur",
    "station_latitude": "25.6997",
    "station_longitude": "85.1937"
  },
  {
    "station_id": "11789",
    "station_name": "HR56_D/s of Mohana, Sonipat",
    "station_latitude": "28.989211",
    "station_longitude": "77.202686"
  },
  {
    "station_id": "11812",
    "station_name": "JH82_Birsa Pool, Damodar River Bank,Pathardih",
    "station_latitude": "23.667",
    "station_longitude": "86.411"
  },
  {
    "station_id": "11813",
    "station_name": "JH83_Sahebganj",
    "station_latitude": "25.2489",
    "station_longitude": "87.6417"
  },
  {
    "station_id": "11820",
    "station_name": "JH84_Rajmahal at Malgodam",
    "station_latitude": "25.0546",
    "station_longitude": "87.8381"
  },
  {
    "station_id": "11785",
    "station_name": "UK51_Abandoned old  bridge, Rudraprayag ",
    "station_latitude": "30.274",
    "station_longitude": "78.9607"
  },
  {
    "station_id": "11821",
    "station_name": "UK52_D/s of Srinagar, Kirtinagar",
    "station_latitude": "30.214",
    "station_longitude": "78.7464"
  },
  {
    "station_id": "11786",
    "station_name": "UK53_D/s of Tehri Dam",
    "station_latitude": "30.367",
    "station_longitude": "78.4794"
  },
  {
    "station_id": "11787",
    "station_name": "UK54_Distributing Canal, Left Bank, Rishikesh",
    "station_latitude": "30.07361",
    "station_longitude": "78.2903"
  },
  {
    "station_id": "11788",
    "station_name": "UK55_D/s of Har Ki Pauri, Dam Kothi, Haridwar",
    "station_latitude": "29.94153",
    "station_longitude": "78.15757"
  },
  {
    "station_id": "11790",
    "station_name": "UT57_Bridge on Hindon river, Rajnagar Ext.Gzb",
    "station_latitude": "28.685751",
    "station_longitude": "77.392687"
  },
  {
    "station_id": "11791",
    "station_name": "UT58_River Kali East, D/s Meerut city, Kaul vill.",
    "station_latitude": "28.860677",
    "station_longitude": "77.795725"
  },
  {
    "station_id": "11792",
    "station_name": "UT59_River Kali East, D/s of Bulandshahr",
    "station_latitude": "28.397028",
    "station_longitude": "77.863309"
  },
  {
    "station_id": "11793",
    "station_name": "UT60_Upstream of Gokul Barrage,D/s of Mathura city",
    "station_latitude": "27.44357",
    "station_longitude": "77.71386"
  },
  {
    "station_id": "11794",
    "station_name": "UT61_Near Galhita on River Hindon,Barnawa,Baghpat",
    "station_latitude": "29.114116",
    "station_longitude": "77.44042"
  },
  {
    "station_id": "11818",
    "station_name": "UT62_River Kosi, D/s of Kashipur, Darhiyal",
    "station_latitude": "28.90421",
    "station_longitude": "79.011582"
  },
  {
    "station_id": "11795",
    "station_name": "UT63_River Yamuna, U/s to Sangam at Allahabad",
    "station_latitude": "25.42967",
    "station_longitude": "81.86069"
  },
  {
    "station_id": "11796",
    "station_name": "UT64_Fafamau, Lord Curzon Bridge, Allahabad",
    "station_latitude": "25.504818",
    "station_longitude": "81.866305"
  },
  {
    "station_id": "11797",
    "station_name": "UT65_Balu ghat bridge, Chunar",
    "station_latitude": "25.1316",
    "station_longitude": "82.8784"
  },
  {
    "station_id": "11798",
    "station_name": "UT66_Ghazipur, Abdul Hameed Setu on River Ganga",
    "station_latitude": "25.5868",
    "station_longitude": "83.60569"
  },
  {
    "station_id": "11799",
    "station_name": "UT67_Kheerveer Bridge,Kishundaspur Road,Pratapgarh",
    "station_latitude": "25.920256",
    "station_longitude": "82.027409"
  },
  {
    "station_id": "11800",
    "station_name": "UT68_Korra Kanak, Asothar, Fatehpur.",
    "station_latitude": "25.78",
    "station_longitude": "80.5778"
  },
  {
    "station_id": "11801",
    "station_name": "UT69_Marhapur, Auraiya",
    "station_latitude": "26.40877",
    "station_longitude": "79.4914"
  },
  {
    "station_id": "11802",
    "station_name": "UT70_Mawai Dham, Amauli, Fatehpur",
    "station_latitude": "25.91217",
    "station_longitude": "80.28931"
  },
  {
    "station_id": "11803",
    "station_name": "UT71_Beladandi Bridge on River Ramganga",
    "station_latitude": "28.029453",
    "station_longitude": "79.494042"
  },
  {
    "station_id": "11814",
    "station_name": "WB85_Raghunathpur Thermal power plant Intake well.",
    "station_latitude": "23.6771",
    "station_longitude": "86.7425"
  },
  {
    "station_id": "11815",
    "station_name": "WB86_Farakka Barrage, Road Bridge",
    "station_latitude": "24.801",
    "station_longitude": "87.922"
  },
  {
    "station_id": "11816",
    "station_name": "WB87_Nabadwip Bathing Ghat",
    "station_latitude": "23.396",
    "station_longitude": "88.3626"
  },
  {
    "station_id": "11817",
    "station_name": "WB88_Chinsura , Near Hooghly, Road Bridge",
    "station_latitude": "22.9068",
    "station_longitude": "88.4039"
  },
  {
    "station_id": "11783",
    "station_name": "WB89_Durgapur barrage, Road Bridge",
    "station_latitude": "23.4801",
    "station_longitude": "87.3049"
  },
  {
    "station_id": "11784",
    "station_name": "WB90_Damodar river Intake well pump house Ramgarh",
    "station_latitude": "23.645699",
    "station_longitude": "85.527719"
  }
]

def seed_data():
    db = SessionLocal()
    try:
        # 0. Clean up existing Stations, Reports, Alerts (to avoid duplicates and stale mock data)
        # Note: Be careful in production. This is a dev seed script.
        logger.info("Cleaning up existing data...")
        db.query(Alert).delete()
        db.query(Report).delete()
        db.query(Station).delete()
        db.commit()

        # 1. Seed Stations
        logger.info(f"Seeding {len(GOVERMENT_STATIONS)} Government Stations...")
        stations_to_add = []
        for st in GOVERMENT_STATIONS:
            stations_to_add.append(Station(
                name=st["station_name"],
                lat=float(st["station_latitude"]),
                lng=float(st["station_longitude"])
            ))
        db.add_all(stations_to_add)
        db.commit()

        # 2. Seed Mock Reports (Linked to new stations)
        # Pick a few stations
        st1 = GOVERMENT_STATIONS[0]["station_name"]
        st2 = GOVERMENT_STATIONS[1]["station_name"]
        st3 = GOVERMENT_STATIONS[2]["station_name"]
        
        reports = [
            Report(description="Water looks cloudy", location="Near Bridge", status="verified", station_name=st1),
            Report(description="Bad smell", location="River Bank", status="pending", station_name=st2),
            Report(description="Dead fish found", location="Lake Edge", status="rejected", station_name=st3),
            Report(description="Oil spill visible", location="Harbor", status="verified", station_name=st1),
            Report(description="High turbidity", location="Canal", status="pending", station_name=st2),
        ]
        db.add_all(reports)
        db.commit()
        logger.info(f"Seeded {len(reports)} mock reports linked to government stations.")

        # 3. Seed Mock Alerts
        alerts = [
            Alert(station_name=st1, level="High", message="pH level critical", status="active", created_at="2024-03-10 10:00"),
            Alert(station_name=st2, level="Warning", message="Turbidity increase", status="resolved", created_at="2024-03-09 15:30"),
            Alert(station_name=st3, level="Critical", message="Low DO", status="active", created_at="2024-03-11 09:15"),
        ]
        db.add_all(alerts)
        db.commit()
        logger.info(f"Seeded {len(alerts)} mock alerts linked to government stations.")

    except Exception as e:
        logger.error(f"Seeding failed: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
