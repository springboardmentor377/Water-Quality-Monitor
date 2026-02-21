import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";

function StationDashboard() {
  const [stations, setStations] = useState([]);

  // Fetch stations
  const fetchStations = async () => {
    try {
      const res = await fetch("http://localhost:8000/stations/");
      const data = await res.json();
      setStations(data);
      console.log("Fetched stations:", data);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  useEffect(() => {
    fetchStations();

    const interval = setInterval(() => {
      fetchStations();
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  // Contamination Logic
  const getStatus = (station) => {
    if (
      station.parameter === "pH" &&
      (station.value < 6.5 || station.value > 8.5)
    )
      return "Contaminated";

    if (
      station.parameter === "lead" &&
      station.value > 0.01
    )
      return "Contaminated";

    return "Safe";
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>

      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {Array.isArray(stations) &&
          stations.map((station) => {
            const status = getStatus(station);
            const color = status === "Contaminated" ? "red" : "green";

            return (
              <CircleMarker
                key={station.id}
                center={[
                  Number(station.latitude),
                  Number(station.longitude),
                ]}
                radius={10}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.8,
                }}
              >
                <Popup>
                  <h3>{station.name}</h3>
                  <p>{station.location}</p>
                  <p><strong>Parameter:</strong> {station.parameter}</p>
                  <p><strong>Value:</strong> {station.value}</p>
                  <p><strong>Status:</strong> {status}</p>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          background: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <div><span style={{ color: "green" }}>●</span> Safe</div>
        <div><span style={{ color: "red" }}>●</span> Contaminated</div>
      </div>
    </div>
  );
}

export default StationDashboard;
