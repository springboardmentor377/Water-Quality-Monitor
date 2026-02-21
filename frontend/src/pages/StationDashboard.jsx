import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";

function StationDashboard() {
  const [stations, setStations] = useState([]);

  // Fetch stations with latest readings
  const fetchStations = async () => {
    try {
      const res = await fetch("http://localhost:8000/stations/with-latest");
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
    }, 600000); // refresh every 10 mins

    return () => clearInterval(interval);
  }, []);

  // Risk Calculation
  const getRisk = (latest) => {
    if (!latest) return "Safe";

    const { pH, turbidity, lead } = latest;

    const high =
      (pH && (pH < 6.0 || pH > 9.0)) ||
      (turbidity && turbidity > 4) ||
      (lead && lead > 0.05);

    const medium =
      (pH && (pH < 6.5 || pH > 8.5)) ||
      (turbidity && turbidity > 2.5) ||
      (lead && lead > 0.01);

    if (high) return "High";
    if (medium) return "Medium";
    return "Safe";
  };

  const getColor = (risk) => {
    if (risk === "High") return "red";
    if (risk === "Medium") return "orange";
    return "green";
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
            const risk = getRisk(station.latest);
            const color = getColor(risk);

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

                  {station.latest ? (
                    <>
                      <p><strong>pH:</strong> {station.latest.pH ?? "N/A"}</p>
                      <p><strong>Turbidity:</strong> {station.latest.turbidity ?? "N/A"}</p>
                      <p><strong>Lead:</strong> {station.latest.lead ?? "N/A"}</p>
                      <p><strong>Status:</strong> {risk}</p>
                    </>
                  ) : (
                    <p>No data available</p>
                  )}
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
        <div><span style={{ color: "orange" }}>●</span> Medium Risk</div>
        <div><span style={{ color: "red" }}>●</span> High Risk</div>
      </div>
    </div>
  );
}

export default StationDashboard;