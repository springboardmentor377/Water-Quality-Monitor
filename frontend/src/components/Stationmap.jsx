import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import api from "../services/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Ensure it's imported here too

export default function Stationmap() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const center = [13.0827, 80.2707]; // Chennai

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await api.get("/stations/");
        setStations(res.data);
      } catch (err) {
        console.error("Map Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Map...</div>;

  return (
    <div style={{ height: "500px", width: "100%", position: "relative" }}> 
      <MapContainer 
        center={center} 
        zoom={11} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {stations.length > 0 && stations.map((station) => (
          <Marker key={station.id} position={[station.lat, station.lng]}>
            <Popup>
              <strong>{station.name}</strong><br />
              Lat: {station.lat}, Lng: {station.lng}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}