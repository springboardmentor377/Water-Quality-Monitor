import { useEffect, useState } from "react";
import api from "../services/api";
import StationMap from "../components/stationmap";

export default function Dashboard() {
  const [stations, setStations] = useState([]);

  useEffect(()=>{
    api.get("/stations").then(res=>setStations(res.data));
  },[]);

  return (
    <div>
      <h1>Dashboard</h1>
      <StationMap stations={stations}/>
    </div>
  );
}
