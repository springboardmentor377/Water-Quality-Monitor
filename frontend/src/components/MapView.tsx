import {MapContainer,TileLayer,Marker,Popup} from "react-leaflet";
import {useEffect,useState} from "react";
import "leaflet/dist/leaflet.css";
import axios from "axios";

export default function MapView(){
  const [stations,setStations]=useState([]);

  useEffect(()=>{
    axios.get("http://127.0.0.1:8000/stations")
      .then(res=>setStations(res.data));
  },[]);
  return(
    <MapContainer center={[20.59, 78.96] as [number, number]} zoom={5} style={{ height: "100vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

      {stations.map((s:any)=>(
        <Marker key={s.id} position={[s.latitude,s.longitude]}>
          <Popup>
            <b>{s.name}</b><br/>
            {s.location}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}