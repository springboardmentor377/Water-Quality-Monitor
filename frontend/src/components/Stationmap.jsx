import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function WaterMap({ stations }) {
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={[13.0827, 80.2707]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {stations.map((s, i) => (
          <Marker key={i} position={[s.lat, s.lng]}>
            <Popup>
              <b>{s.station}</b><br />
              pH: {s.ph}<br />
              TDS: {s.tds}<br />
              Status: {s.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default WaterMap;
