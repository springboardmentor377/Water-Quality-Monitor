import { useEffect, useState } from "react";
import TopBar from "../components/TopBar.jsx";
import AnalyticsPanel from "../components/AnalyticsPanel.jsx";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    medium: 0,
    high: 0,
  });

  useEffect(() => {
    fetch("http://localhost:8000/stations/with-latest")
      .then((res) => res.json())
      .then((data) => {
        let safe = 0;
        let medium = 0;
        let high = 0;

        data.forEach((station) => {
          if (station.risk === "High") high++;
          else if (station.risk === "Medium") medium++;
          else safe++;
        });

        setStats({
          total: data.length,
          safe,
          medium,
          high,
        });
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div
      style={{
        background: "#f3f4f6",
        minHeight: "100vh",
        width: "100%",
        padding: "20px 40px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginTop: "40px" }}>
        <TopBar />
      </div>

      {/* Status Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          margin: "30px 0",
        }}
      >
        <div style={cardStyle("#2563eb")}>
          <h3>Total Stations</h3>
          <p>{stats.total}</p>
        </div>

        <div style={cardStyle("#16a34a")}>
          <h3>Safe</h3>
          <p>{stats.safe}</p>
        </div>

        <div style={cardStyle("#f59e0b")}>
          <h3>Medium Risk</h3>
          <p>{stats.medium}</p>
        </div>

        <div style={cardStyle("#dc2626")}>
          <h3>High Risk</h3>
          <p>{stats.high}</p>
        </div>
      </div>

      <AnalyticsPanel />
    </div>
  );
}

// Reusable card style
const cardStyle = (borderColor) => ({
  background: "white",
  padding: "15px 20px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 3px 8px rgba(0,0,0,0.06)",
  borderLeft: `5px solid ${borderColor}`,
  minHeight: "100px",
});

export default Dashboard;