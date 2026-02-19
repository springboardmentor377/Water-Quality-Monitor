import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

export const stationData = [
  {
    "station_id": "11819",
    "station_no": "BH72",
    "station_name": "BH72_River Ganga at Chausa, U/s of Buxar ",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.5193",
    "station_longitude": "83.9007",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Bihar",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-308",
    "station_diary_status": "2022-08-31 19:00:00: FM Start: Flood event<br>2022-09-06 15:00:00: FM End: Flood event<br>2024-12-20 16:00:00: FM Start: Technical issue<br>2024-12-20 18:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11804",
    "station_no": "BH73",
    "station_name": "BH73_Bridge on Ghagra near Manjhi, Chappra",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.8232",
    "station_longitude": "84.5858",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Bihar",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-328",
    "station_diary_status": "2024-05-27 13:00:00: FM Start: Vandalism<br>2024-06-06 12:00:00: FM End: Vandalism<br>2024-12-19 13:00:00: FM Start: Technical issue<br>2024-12-19 15:00:00: FM End: Technical issue<br>2025-03-20 19:00:00: FM Start: Vandalism<br>2025-04-05 15:00:00: FM End: Vandalism"
  },
  {
    "station_id": "11805",
    "station_no": "BH74",
    "station_name": "BH74_Road bridge on River Ganga, D/s of Buxar",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.5918",
    "station_longitude": "83.9861",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Bihar",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-309",
    "station_diary_status": "2022-08-19 17:00:00: FM Start: Flood event<br>2022-09-17 14:00:00: FM End: Flood event<br>2022-09-20 19:30:00: FM Start: Flood event<br>2022-10-29 14:00:00: FM End: Flood event<br>2024-05-21 05:00:00: FM Start: Flood event<br>2024-06-19 13:00:00: FM End: Flood event<br>2024-08-02 15:00:00: FM Start: Flood event<br>2024-08-16 13:00:00: FM End: Flood event<br>2024-12-20 14:00:00: FM Start: Technical issue<br>2024-12-20 15:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11822",
    "station_no": "BH75",
    "station_name": "BH75_D/s of Bhagalpur, Road Bridge on River Ganga",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.30783",
    "station_longitude": "87.016618",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Bihar",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-299",
    "station_diary_status": "2022-08-28 08:30:00: FM Start: Flood event<br>2022-09-09 13:00:00: FM End: Reason<br>2024-09-01 12:00:00: FM Start: Flood event<br>2024-11-06 00:00:00: FM End: Flood event<br>2024-12-17 11:00:00: FM Start: Technical issue<br>2024-12-17 14:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11806",
    "station_no": "BH76",
    "station_name": "BH76_Road bridge at Fathua on Punpun, Patna",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.51046",
    "station_longitude": "85.30732",
    "object_type": "General;Floating Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Bihar",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-302",
    "station_diary_status": "2023-12-03 15:00:00: FM Start: Vandalism<br>2023-12-06 09:00:00: FM End: Vandalism<br>2024-12-18 10:00:00: FM Start: Technical issue<br>2024-12-18 13:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11807",
    "station_no": "BH77",
    "station_name": "BH77_New Bridge, U/s of Patna city, Khurji",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.6533",
    "station_longitude": "85.0952",
    "object_type": "General;Floating Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Bihar",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-256",
    "station_diary_status": "2022-08-23 04:00:00: FM Start: Flood event<br>2022-09-17 09:00:00: FM End: Flood event<br>2022-09-26 10:00:00: FM Start: Flood event<br>2022-10-04 15:00:00: FM End: Reason<br>2022-10-17 17:00:00: FM Start: Flood event<br>2022-10-23 14:00:00: FM End: Reason<br>2023-08-08 01:00:00: FM Start: Flood event<br>2024-03-01 13:50:00: FM End: Flood event<br>2024-03-01 13:50:00: FM Start: Flood event<br>2024-03-13 08:57:00: FM End: Flood event"
  },
  {
    "station_id": "11808",
    "station_no": "BH78",
    "station_name": "BH78_Road bridge on Burhi Gandak, Khagaria",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.501",
    "station_longitude": "86.4812",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Bihar",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-320",
    "station_diary_status": "2023-06-19 18:00:00: FM Start: Vandalism<br>2023-06-20 08:00:00: FM End: Vandalism<br>2023-06-20 17:00:00: FM Start: Vandalism<br>2023-06-21 08:00:00: FM End: Vandalism<br>2023-06-21 16:00:00: FM Start: Vandalism<br>2023-06-22 08:00:00: FM End: Vandalism<br>2024-12-21 12:00:00: FM Start: Technical issue<br>2024-12-21 17:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11809",
    "station_no": "BH79",
    "station_name": "BH79_Road bridge on Kosi, Kursela",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.4238",
    "station_longitude": "87.2336",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Bihar",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-348",
    "station_diary_status": "2024-12-23 13:00:00: FM Start: Technical issue<br>2024-12-23 15:00:00: FM End: Technical issue<br>2025-10-08 14:00:00: FM Start: Flood event<br>2025-10-12 17:10:00: FM End: Flood event"
  },
  {
    "station_id": "11810",
    "station_no": "BH80",
    "station_name": "BH80_Road bridge on Son, Arrah",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.5672",
    "station_longitude": "84.7961",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Bihar",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-351",
    "station_diary_status": "2022-07-09 00:00:00: FM Start: Low water<br>2022-08-06 00:00:00: FM End: Reason<br>2024-12-21 11:00:00: FM Start: Technical issue<br>2024-12-21 15:00:00: FM End: Technical issue<br>2025-06-21 17:00:00: FM Start: Flood event<br>2025-08-02 13:00:00: FM End: Flood event<br>2025-11-02 08:30:00: FM Start: Flood event"
  },
  {
    "station_id": "11811",
    "station_no": "BH81",
    "station_name": "BH81_Road Bridge on Gandak, Hajipur",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.6997",
    "station_longitude": "85.1937",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Bihar",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-295",
    "station_diary_status": "2022-08-07 17:00:00: FM Start: Flood event<br>2022-11-03 13:00:00: FM End: Flood event<br>2023-08-17 14:00:00: FM Start: Reason<br>2023-10-29 15:00:00: FM End: Reason<br>2024-12-16 19:00:00: FM Start: Technical issue<br>2024-12-16 20:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11789",
    "station_no": "HR56",
    "station_name": "HR56_D/s of Mohana, Sonipat",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "28.989211",
    "station_longitude": "77.202686",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Haryana",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-331",
    "station_diary_status": "2022-09-02 00:00:00: FM Start: Low water<br>2022-09-07 09:00:00: FM End: Reason<br>2024-06-13 14:00:00: FM Start: Low water<br>2024-07-28 12:00:00: FM End: Low water<br>2024-12-17 12:00:00: FM Start: Technical issue<br>2024-12-17 15:00:00: FM End: Technical issue<br>2025-06-14 14:00:00: FM Start: Low water<br>2025-07-01 01:00:00: FM End: Low water"
  },
  {
    "station_id": "11812",
    "station_no": "JH82",
    "station_name": "JH82_Birsa Pool, Damodar River Bank,Pathardih",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "23.667",
    "station_longitude": "86.411",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Jharkhand",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-335",
    "station_diary_status": "2022-07-13 00:00:00: FM Start: Low water<br>2022-08-11 03:00:00: FM End: Reason<br>2022-08-24 15:00:00: FM Start: Flood event<br>2022-10-28 17:00:00: FM End: Flood event<br>2024-08-03 08:00:00: FM Start: Flood event<br>2024-08-20 18:00:00: FM End: Flood event<br>2024-12-25 16:00:00: FM Start: Technical issue<br>2024-12-25 18:00:00: FM End: Technical issue<br>2025-07-11 06:00:00: FM Start: Flood event<br>2025-07-14 16:00:00: FM End: Flood event"
  },
  {
    "station_id": "11813",
    "station_no": "JH83",
    "station_name": "JH83_Sahebganj",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.2489",
    "station_longitude": "87.6417",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Jharkhand",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-322",
    "station_diary_status": "2023-04-03 10:00:00: FM Start: Reason<br>2023-04-04 18:00:00: FM End: Reason<br>2024-12-24 12:00:00: FM Start: Technical issue<br>2024-12-24 14:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11820",
    "station_no": "JH84",
    "station_name": "JH84_Rajmahal at Malgodam",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.0546",
    "station_longitude": "87.8381",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Jharkhand",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-353",
    "station_diary_status": "2022-12-07 17:00:00: FM Start: Low water<br>2023-06-11 18:00:00: FM End: Reason<br>2024-12-23 09:00:00: FM Start: Technical issue<br>2024-12-23 11:00:00: FM End: Technical issue<br>2025-11-20 07:00:00: FM Start: Low water"
  },
  {
    "station_id": "11785",
    "station_no": "UK51",
    "station_name": "UK51_Abandoned old  bridge, Rudraprayag ",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "30.274",
    "station_longitude": "78.9607",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttarakhand",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-71",
    "station_diary_status": "2022-07-11 00:00:00: FM Start: Flood event<br>2022-09-18 19:00:00: FM End: Flood event<br>2023-01-17 13:00:00: FM Start: Low water<br>2023-06-16 09:00:00: FM End: Reason<br>2023-06-25 09:00:00: FM Start: Reason<br>2023-06-26 09:00:00: FM End: Reason<br>2023-06-26 09:00:00: FM Start: Technical issue<br>2024-12-18 18:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11821",
    "station_no": "UK52",
    "station_name": "UK52_D/s of Srinagar, Kirtinagar",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "30.214",
    "station_longitude": "78.7464",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttarakhand",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-315",
    "station_diary_status": "2024-12-23 18:00:00: FM Start: Technical issue<br>2024-12-23 19:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11786",
    "station_no": "UK53",
    "station_name": "UK53_D/s of Tehri Dam",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "30.367",
    "station_longitude": "78.4794",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttarakhand",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-317",
    "station_diary_status": "2023-01-27 21:00:00: FM Start: Low water<br>2023-02-03 17:00:00: FM End: Reason<br>2023-02-13 21:00:00: FM Start: Low water<br>2023-08-03 12:00:00: FM End: Reason<br>2024-03-29 15:00:00: FM Start: Low water<br>2024-07-08 13:00:00: FM End: Low water<br>2024-12-21 12:00:00: FM Start: Technical issue<br>2024-12-21 14:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11787",
    "station_no": "UK54",
    "station_name": "UK54_Distributing Canal, Left Bank, Rishikesh",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "30.07361",
    "station_longitude": "78.2903",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttarakhand",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-263",
    "station_diary_status": "2022-07-28 18:00:00: FM Start: Low water<br>2022-07-31 19:00:00: FM End: Reason<br>2022-08-28 02:00:00: FM Start: Flood event<br>2022-11-23 11:00:00: FM End: Flood event<br>2024-05-25 10:00:00: FM Start: Low water<br>2024-07-29 14:00:00: FM End: Low water"
  },
  {
    "station_id": "11788",
    "station_no": "UK55",
    "station_name": "UK55_D/s of Har Ki Pauri, Dam Kothi, Haridwar",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "29.94153",
    "station_longitude": "78.15757",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttarakhand",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-290",
    "station_diary_status": "2023-07-10 05:30:00: FM Start: Reason<br>2023-07-12 11:00:00: FM End: Reason<br>2023-10-27 11:00:00: FM Start: Low water<br>2023-11-14 09:00:00: FM End: Reason<br>2024-10-16 08:00:00: FM Start: Low water<br>2024-10-31 06:00:00: FM End: Low water"
  },
  {
    "station_id": "11790",
    "station_no": "UT57",
    "station_name": "UT57_Bridge on Hindon river, Rajnagar Ext.Gzb",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "28.685751",
    "station_longitude": "77.392687",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-79",
    "station_diary_status": "2022-07-07 23:00:00: FM Start: Reason<br>2022-09-07 18:00:00: FM End: Reason<br>2023-01-24 11:00:00: FM Start: Low water<br>2023-01-25 20:00:00: FM End: Reason<br>2023-07-19 18:00:00: FM Start: Technical issue"
  },
  {
    "station_id": "11791",
    "station_no": "UT58",
    "station_name": "UT58_River Kali East, D/s Meerut city, Kaul vill.",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "28.860677",
    "station_longitude": "77.795725",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "05072022",
    "station_diary_status": "2022-07-05 00:00:00: FM Start: Technical issue"
  },
  {
    "station_id": "11792",
    "station_no": "UT59",
    "station_name": "UT59_River Kali East, D/s of Bulandshahr",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "28.397028",
    "station_longitude": "77.863309",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "UT-59-07072022",
    "station_diary_status": "2022-07-07 00:00:00: FM Start: Technical issue"
  },
  {
    "station_id": "11793",
    "station_no": "UT60",
    "station_name": "UT60_Upstream of Gokul Barrage,D/s of Mathura city",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "27.44357",
    "station_longitude": "77.71386",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-318",
    "station_diary_status": "2022-08-02 07:00:00: FM Start: Low water<br>2022-08-05 09:00:00: FM End: Reason<br>2022-08-08 10:00:00: FM Start: Low water<br>2022-08-17 08:00:00: FM End: Reason<br>2023-07-11 07:00:00: FM Start: Reason<br>2023-07-20 15:00:00: FM End: Reason<br>2024-12-21 09:00:00: FM Start: Technical issue<br>2024-12-21 10:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11794",
    "station_no": "UT61",
    "station_name": "UT61_Near Galhita on River Hindon,Barnawa,Baghpat",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "29.114116",
    "station_longitude": "77.44042",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-310",
    "station_diary_status": "2022-07-05 23:00:00: FM Start: Low water<br>2023-08-07 16:00:00: FM End: Reason<br>2023-12-11 07:00:00: FM Start: Low water<br>2023-12-11 10:00:00: FM End: Low water<br>2024-01-25 06:00:00: FM Start: Low water<br>2024-05-18 14:00:00: FM End: Low water<br>2024-10-22 10:00:00: FM Start: Low water<br>2024-11-09 10:00:00: FM End: Low water<br>2024-12-19 11:00:00: FM Start: Low water"
  },
  {
    "station_id": "11818",
    "station_no": "UT62",
    "station_name": "UT62_River Kosi, D/s of Kashipur, Darhiyal",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "28.90421",
    "station_longitude": "79.011582",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-324",
    "station_diary_status": "2024-12-24 13:00:00: FM Start: Technical issue<br>2024-12-24 14:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11795",
    "station_no": "UT63",
    "station_name": "UT63_River Yamuna, U/s to Sangam at Allahabad",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.42967",
    "station_longitude": "81.86069",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-294",
    "station_diary_status": "2022-08-27 11:00:00: FM Start: Flood event<br>2022-09-05 15:00:00: FM End: Reason<br>2023-04-16 11:00:00: FM Start: Reason<br>2023-04-17 01:00:00: FM End: Reason<br>2024-12-16 19:00:00: FM Start: Technical issue<br>2024-12-16 20:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11796",
    "station_no": "UT64",
    "station_name": "UT64_Fafamau, Lord Curzon Bridge, Allahabad",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.504818",
    "station_longitude": "81.866305",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-292",
    "station_diary_status": "2022-08-07 16:00:00: FM Start: Flood event<br>2022-09-06 16:00:00: FM End: Reason<br>2023-04-17 01:00:00: FM Start: Reason<br>2023-04-17 05:00:00: FM End: Reason<br>2024-12-16 12:00:00: FM Start: Technical issue<br>2024-12-16 13:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11797",
    "station_no": "UT65",
    "station_name": "UT65_Balu ghat bridge, Chunar",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.1316",
    "station_longitude": "82.8784",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-316",
    "station_diary_status": "2022-08-18 19:00:00: FM Start: Flood event<br>2022-09-07 14:00:00: FM End: Reason<br>2024-12-23 18:00:00: FM Start: Technical issue<br>2024-12-23 19:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11798",
    "station_no": "UT66",
    "station_name": "UT66_Ghazipur, Abdul Hameed Setu on River Ganga",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.5868",
    "station_longitude": "83.60569",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-323",
    "station_diary_status": "2022-07-26 12:00:00: FM Start: Flood event<br>2022-11-15 15:00:00: FM End: Flood event<br>2023-06-29 22:00:00: FM Start: Technical issue<br>2024-11-06 12:00:00: FM End: Technical issue<br>2024-12-24 11:00:00: FM Start: Technical issue<br>2024-12-24 12:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11799",
    "station_no": "UT67",
    "station_name": "UT67_Kheerveer Bridge,Kishundaspur Road,Pratapgarh",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.920256",
    "station_longitude": "82.027409",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-301",
    "station_diary_status": "2023-11-05 15:00:00: FM Start: Technical issue<br>2024-10-20 16:00:00: FM End: Technical issue<br>2024-12-18 10:00:00: FM Start: Technical issue<br>2024-12-18 11:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11800",
    "station_no": "UT68",
    "station_name": "UT68_Korra Kanak, Asothar, Fatehpur.",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.78",
    "station_longitude": "80.5778",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-319",
    "station_diary_status": "2022-07-27 07:00:00: FM Start: Flood event<br>2022-08-08 08:00:00: FM End: Flood event<br>2022-08-14 21:00:00: FM Start: Flood event<br>2022-09-14 11:00:00: FM End: Reason<br>2022-09-17 08:00:00: FM Start: Flood event<br>2022-10-01 10:00:00: FM End: Reason<br>2022-10-11 10:00:00: FM Start: Low water<br>2024-12-21 11:00:00: FM Start: Technical issue<br>2024-12-21 12:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11801",
    "station_no": "UT69",
    "station_name": "UT69_Marhapur, Auraiya",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "26.40877",
    "station_longitude": "79.4914",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-304",
    "station_diary_status": "2022-07-19 06:00:00: FM Start: Flood event<br>2022-08-04 12:00:00: FM End: Flood event<br>2022-08-14 19:00:00: FM Start: Flood event<br>2022-09-08 19:00:00: FM End: Reason<br>2024-12-19 14:00:00: FM Start: Technical issue<br>2024-12-19 15:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11802",
    "station_no": "UT70",
    "station_name": "UT70_Mawai Dham, Amauli, Fatehpur",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "25.91217",
    "station_longitude": "80.28931",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-307",
    "station_diary_status": "2022-08-18 07:00:00: FM Start: Flood event<br>2022-09-10 13:00:00: FM End: Reason<br>2024-08-21 15:00:00: FM Start: Flood event<br>2024-08-30 17:00:00: FM End: Flood event<br>2024-12-20 12:00:00: FM Start: Technical issue<br>2024-12-20 13:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11803",
    "station_no": "UT71",
    "station_name": "UT71_Beladandi Bridge on River Ramganga",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "28.029453",
    "station_longitude": "79.494042",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "Uttar Pradesh",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-347",
    "station_diary_status": "2023-09-01 15:00:00: FM Start: Flood event<br>2023-10-18 13:00:00: FM End: Flood event<br>2024-07-22 14:00:00: FM Start: Technical issue<br>2024-07-23 21:00:00: FM End: Technical issue<br>2024-12-23 11:00:00: FM Start: Technical issue<br>2024-12-23 14:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11814",
    "station_no": "WB85",
    "station_name": "WB85_Raghunathpur Thermal power plant Intake well.",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "23.6771",
    "station_longitude": "86.7425",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "West Bengal",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-297",
    "station_diary_status": "2022-07-24 03:00:00: FM Start: Low water<br>2022-08-04 12:00:00: FM End: Reason<br>2024-12-17 14:00:00: FM Start: Technical issue<br>2024-12-17 15:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11815",
    "station_no": "WB86",
    "station_name": "WB86_Farakka Barrage, Road Bridge",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "24.801",
    "station_longitude": "87.922",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "West Bengal",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-314",
    "station_diary_status": "2024-12-23 16:00:00: FM Start: Technical issue<br>2024-12-23 17:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11816",
    "station_no": "WB87",
    "station_name": "WB87_Nabadwip Bathing Ghat",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "23.396",
    "station_longitude": "88.3626",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "West Bengal",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-296",
    "station_diary_status": "2024-12-16 19:00:00: FM Start: Technical issue<br>2024-12-16 20:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11817",
    "station_no": "WB88",
    "station_name": "WB88_Chinsura , Near Hooghly, Road Bridge",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "22.9068",
    "station_longitude": "88.4039",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "West Bengal",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-293",
    "station_diary_status": "2024-12-16 12:00:00: FM Start: Technical issue<br>2024-12-16 17:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11783",
    "station_no": "WB89",
    "station_name": "WB89_Durgapur barrage, Road Bridge",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "23.4801",
    "station_longitude": "87.3049",
    "object_type": "General;Fixed Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "West Bengal",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-303",
    "station_diary_status": "2024-08-12 15:00:00: FM Start: Flood event<br>2024-09-09 14:00:00: FM End: Flood event<br>2024-12-18 14:00:00: FM Start: Technical issue<br>2024-12-18 16:00:00: FM End: Technical issue"
  },
  {
    "station_id": "11784",
    "station_no": "WB90",
    "station_name": "WB90_Damodar river Intake well pump house Ramgarh",
    "site_no": "DSP_SWAN",
    "site_name": "DSP SWAN",
    "station_latitude": "23.645699",
    "station_longitude": "85.527719",
    "object_type": "General;Floating Station;Force Majeure;Swan",
    "catchment_name": "---",
    "territory_name": "West Bengal",
    "ObjectDescription": "",
    "station_status_remark": "SDGAN-332",
    "station_diary_status": "2024-08-03 00:07:00: FM Start: Flood event<br>2024-08-08 16:00:00: FM End: Flood event<br>2024-12-19 15:00:00: FM Start: Technical issue<br>2024-12-19 17:00:00: FM End: Technical issue"
  }
];

export default function Stationmap() {
  // Center of the Ganges Basin coverage
  const center = [26.5, 83.0];

  return (
    <div
      className="relative"
      style={{
        height: "100%",
        minHeight: "500px",
        width: "100%",
        backgroundColor: "#0f172a",
      }}
    >
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: "100%", width: "100%", minHeight: "500px" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {stationData.map((station) => {
          const lat = parseFloat(station.station_latitude);
          const lng = parseFloat(station.station_longitude);

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={station.station_id} position={[lat, lng]}>
              <Popup>
                <div className="text-gray-800 p-1">
                  <h3 className="font-bold text-base mb-1">{station.station_name}</h3>
                  <div className="space-y-1 text-xs">
                    <p><span className="font-semibold">ID:</span> {station.station_id}</p>
                    <p><span className="font-semibold">No:</span> {station.station_no}</p>
                    <p><span className="font-semibold">Territory:</span> {station.territory_name}</p>
                    <p><span className="font-semibold">Catchment:</span> {station.catchment_name}</p>
                    <p>
                      <span className="font-semibold">Coords:</span> {lat.toFixed(4)}, {lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}