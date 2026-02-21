import { useEffect, useState } from "react";

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/alerts/")
      .then(res => res.json())
      .then(data => setAlerts(data));
  }, []);

  const getColor = (type) => {
    if (type === "contamination") return "#dc2626";
    if (type === "boil_notice") return "#f59e0b";
    return "#2563eb";
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Active Alerts</h2>

      {alerts.map(alert => (
        <div
          key={alert.id}
          style={{
            background: getColor(alert.type),
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "15px"
          }}
        >
          <h3>{alert.message}</h3>
          <p><strong>Location:</strong> {alert.location}</p>
          <p><strong>Status:</strong> {alert.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Alerts;