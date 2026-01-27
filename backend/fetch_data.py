import requests
from database import SessionLocal
from models import WaterStations

URL="https://thaqmsdbl.cpcb.gov.in/data/internet/stations/stations.json"

def serialize_station(s):
    return {
        "station_id":int(s["station_id"]),
        "name":s["station_no"],
        "location":s["station_name"],
        "latitude":float(s["station_latitude"]),
        "longitude":float(s["station_longitude"]),
        "managed_by":"CPCB"
    }

def fetch_waterstations():

    r=requests.get(URL,verify=False)
    data=r.json()

    db=SessionLocal()

    for s in data[:50]:   # only 50 stations
        d=serialize_station(s)

        exists=db.query(WaterStations)\
            .filter(WaterStations.station_id==d["station_id"])\
            .first()

        if not exists:
            db.add(WaterStations(**d))

    db.commit()
    db.close()

    print("Stations loaded")