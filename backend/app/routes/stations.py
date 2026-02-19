from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Station

router = APIRouter(prefix="/stations", tags=["Stations"])


@router.get("/")
def get_stations(db: Session = Depends(get_db)):
    # This now pulls from your PostgreSQL 'stations' table
    stations = db.query(Station).all()
    # If database is empty, return a fallback or empty list
    if not stations:
        return [
            {"station_id": "11819", "station_no": "BH72", "station_name": "BH72_River Ganga at Chausa, U/s of Buxar ", "station_latitude": "25.5193", "station_longitude": "83.9007", "territory_name": "Bihar"},
            {"station_id": "11804", "station_no": "BH73", "station_name": "BH73_Bridge on Ghagra near Manjhi, Chappra", "station_latitude": "25.8232", "station_longitude": "84.5858", "territory_name": "Bihar"},
            {"station_id": "11805", "station_no": "BH74", "station_name": "BH74_Road bridge on River Ganga, D/s of Buxar", "station_latitude": "25.5918", "station_longitude": "83.9861", "territory_name": "Bihar"},
            {"station_id": "11822", "station_no": "BH75", "station_name": "BH75_D/s of Bhagalpur, Road Bridge on River Ganga", "station_latitude": "25.30783", "station_longitude": "87.016618", "territory_name": "Bihar"},
            {"station_id": "11806", "station_no": "BH76", "station_name": "BH76_Road bridge at Fathua on Punpun, Patna", "station_latitude": "25.51046", "station_longitude": "85.30732", "territory_name": "Bihar"},
            {"station_id": "11807", "station_no": "BH77", "station_name": "BH77_New Bridge, U/s of Patna city, Khurji", "station_latitude": "25.6533", "station_longitude": "85.0952", "territory_name": "Bihar"},
            {"station_id": "11808", "station_no": "BH78", "station_name": "BH78_Road bridge on Burhi Gandak, Khagaria", "station_latitude": "25.501", "station_longitude": "86.4812", "territory_name": "Bihar"},
            {"station_id": "11809", "station_no": "BH79", "station_name": "BH79_Road bridge on Kosi, Kursela", "station_latitude": "25.4238", "station_longitude": "87.2336", "territory_name": "Bihar"},
            {"station_id": "11810", "station_no": "BH80", "station_name": "BH80_Road bridge on Son, Arrah", "station_latitude": "25.5672", "station_longitude": "84.7961", "territory_name": "Bihar"},
            {"station_id": "11811", "station_no": "BH81", "station_name": "BH81_Road Bridge on Gandak, Hajipur", "station_latitude": "25.6997", "station_longitude": "85.1937", "territory_name": "Bihar"},
            {"station_id": "11789", "station_no": "HR56", "station_name": "HR56_D/s of Mohana, Sonipat", "station_latitude": "28.989211", "station_longitude": "77.202686", "territory_name": "Haryana"},
            {"station_id": "11812", "station_no": "JH82", "station_name": "JH82_Birsa Pool, Damodar River Bank,Pathardih", "station_latitude": "23.667", "station_longitude": "86.411", "territory_name": "Jharkhand"},
            {"station_id": "11813", "station_no": "JH83", "station_name": "JH83_Sahebganj", "station_latitude": "25.2489", "station_longitude": "87.6417", "territory_name": "Jharkhand"},
            {"station_id": "11820", "station_no": "JH84", "station_name": "JH84_Rajmahal at Malgodam", "station_latitude": "25.0546", "station_longitude": "87.8381", "territory_name": "Jharkhand"},
            {"station_id": "11785", "station_no": "UK51", "station_name": "UK51_Abandoned old bridge, Rudraprayag ", "station_latitude": "30.274", "station_longitude": "78.9607", "territory_name": "Uttarakhand"},
            {"station_id": "11821", "station_no": "UK52", "station_name": "UK52_D/s of Srinagar, Kirtinagar", "station_latitude": "30.214", "station_longitude": "78.7464", "territory_name": "Uttarakhand"},
            {"station_id": "11786", "station_no": "UK53", "station_name": "UK53_D/s of Tehri Dam", "station_latitude": "30.367", "station_longitude": "78.4794", "territory_name": "Uttarakhand"},
            {"station_id": "11787", "station_no": "UK54", "station_name": "UK54_Distributing Canal, Left Bank, Rishikesh", "station_latitude": "30.07361", "station_longitude": "78.2903", "territory_name": "Uttarakhand"},
            {"station_id": "11788", "station_no": "UK55", "station_name": "UK55_D/s of Har Ki Pauri, Dam Kothi, Haridwar", "station_latitude": "29.94153", "station_longitude": "78.15757", "territory_name": "Uttarakhand"},
            {"station_id": "11790", "station_no": "UT57", "station_name": "UT57_Bridge on Hindon river, Rajnagar Ext.Gzb", "station_latitude": "28.685751", "station_longitude": "77.392687", "territory_name": "Uttar Pradesh"},
            {"station_id": "11791", "station_no": "UT58", "station_name": "UT58_River Kali East, D/s Meerut city, Kaul vill.", "station_latitude": "28.860677", "station_longitude": "77.795725", "territory_name": "Uttar Pradesh"},
            {"station_id": "11792", "station_no": "UT59", "station_name": "UT59_River Kali East, D/s of Bulandshahr", "station_latitude": "28.397028", "station_longitude": "77.863309", "territory_name": "Uttar Pradesh"},
            {"station_id": "11793", "station_no": "UT60", "station_name": "UT60_Upstream of Gokul Barrage,D/s of Mathura city", "station_latitude": "27.44357", "station_longitude": "77.71386", "territory_name": "Uttar Pradesh"},
            {"station_id": "11794", "station_no": "UT61", "station_name": "UT61_Near Galhita on River Hindon,Barnawa,Baghpat", "station_latitude": "29.114116", "station_longitude": "77.44042", "territory_name": "Uttar Pradesh"},
            {"station_id": "11818", "station_no": "UT62", "station_name": "UT62_River Kosi, D/s of Kashipur, Darhiyal", "station_latitude": "28.90421", "station_longitude": "79.011582", "territory_name": "Uttar Pradesh"},
            {"station_id": "11795", "station_no": "UT63", "station_name": "UT63_River Yamuna, U/s to Sangam at Allahabad", "station_latitude": "25.42967", "station_longitude": "81.86069", "territory_name": "Uttar Pradesh"},
            {"station_id": "11796", "station_no": "UT64", "station_name": "UT64_Fafamau, Lord Curzon Bridge, Allahabad", "station_latitude": "25.504818", "station_longitude": "81.866305", "territory_name": "Uttar Pradesh"},
            {"station_id": "11797", "station_no": "UT65", "station_name": "UT65_Balu ghat bridge, Chunar", "station_latitude": "25.1316", "station_longitude": "82.8784", "territory_name": "Uttar Pradesh"},
            {"station_id": "11798", "station_no": "UT66", "station_name": "UT66_Ghazipur, Abdul Hameed Setu on River Ganga", "station_latitude": "25.5868", "station_longitude": "83.60569", "territory_name": "Uttar Pradesh"},
            {"station_id": "11799", "station_no": "UT67", "station_name": "UT67_Kheerveer Bridge,Kishundaspur Road,Pratapgarh", "station_latitude": "25.920256", "station_longitude": "82.027409", "territory_name": "Uttar Pradesh"},
            {"station_id": "11800", "station_no": "UT68", "station_name": "UT68_Korra Kanak, Asothar, Fatehpur.", "station_latitude": "25.78", "station_longitude": "80.5778", "territory_name": "Uttar Pradesh"},
            {"station_id": "11801", "station_no": "UT69", "station_name": "UT69_Marhapur, Auraiya", "station_latitude": "26.40877", "station_longitude": "79.4914", "territory_name": "Uttar Pradesh"},
            {"station_id": "11802", "station_no": "UT70", "station_name": "UT70_Mawai Dham, Amauli, Fatehpur", "station_latitude": "25.91217", "station_longitude": "80.28931", "territory_name": "Uttar Pradesh"},
            {"station_id": "11803", "station_no": "UT71", "station_name": "UT71_Beladandi Bridge on River Ramganga", "station_latitude": "28.029453", "station_longitude": "79.494042", "territory_name": "Uttar Pradesh"},
            {"station_id": "11814", "station_no": "WB85", "station_name": "WB85_Raghunathpur Thermal power plant Intake well.", "station_latitude": "23.6771", "station_longitude": "86.7425", "territory_name": "West Bengal"},
            {"station_id": "11815", "station_no": "WB86", "station_name": "WB86_Farakka Barrage, Road Bridge", "station_latitude": "24.801", "station_longitude": "87.922", "territory_name": "West Bengal"},
            {"station_id": "11816", "station_no": "WB87", "station_name": "WB87_Nabadwip Bathing Ghat", "station_latitude": "23.396", "station_longitude": "88.3626", "territory_name": "West Bengal"},
            {"station_id": "11817", "station_no": "WB88", "station_name": "WB88_Chinsura , Near Hooghly, Road Bridge", "station_latitude": "22.9068", "station_longitude": "88.4039", "territory_name": "West Bengal"},
            {"station_id": "11783", "station_no": "WB89", "station_name": "WB89_Durgapur barrage, Road Bridge", "station_latitude": "23.4801", "station_longitude": "87.3049", "territory_name": "West Bengal"},
            {"station_id": "11784", "station_no": "WB90", "station_name": "WB90_Damodar river Intake well pump house Ramgarh", "station_latitude": "23.645699", "station_longitude": "85.527719", "territory_name": "West Bengal"}
        ]
    return stations