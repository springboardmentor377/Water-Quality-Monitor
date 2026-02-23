<<<<<<< HEAD
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import { useEffect, useState } from "react";
import api from "../services/api";

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

export default function Stationmap() {
  const [stations, setStations] = useState([]);
  // Center of the Ganges Basin coverage
  const center = [26.5, 83.0];

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await api.get("/stations/");
        setStations(response.data);
      } catch (error) {
        console.error("Error fetching stations for map:", error);
      }
    };
    fetchStations();
  }, []);

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

        {stations.map((station) => {
          // API returns 'lat', 'lng', 'name', 'id'
          const lat = parseFloat(station.lat);
          const lng = parseFloat(station.lng);

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={station.id} position={[lat, lng]}>
              <Popup>
                <div className="text-gray-800 p-1">
                  <h3 className="font-bold text-base mb-1">{station.name}</h3>
                  <div className="space-y-1 text-xs">
                    <p><span className="font-semibold">ID:</span> {station.id}</p>
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
=======
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
>>>>>>> origin/main
}