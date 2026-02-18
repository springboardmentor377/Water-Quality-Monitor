import React, { useEffect, useState } from "react";
import { getAlerts } from "../services/api";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#FF8042", "#FFBB28"];

const Alert = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [form, setForm] = useState({
    alert_type: "",
    message: "",
    location: "",
    station_id: ""
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = () => {
    getAlerts().then(res => setAlerts(res.data));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await axios.post("http://localhost:8000/alert", {
      ...form,
      station_id: Number(form.station_id)
    });

    fetchAlerts();
    alert("Alert Created");
  };

  const pieData = [
    {
      name: "Boil Notice",
      value: alerts.filter(a => a.alert_type === "boil_notice").length
    },
    {
      name: "Contamination",
      value: alerts.filter(a => a.alert_type === "contamination").length
    },
    {
      name: "Outage",
      value: alerts.filter(a => a.alert_type === "outage").length
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Alerts</h2>

      {/* Create Alert */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <select
          onChange={e => setForm({ ...form, alert_type: e.target.value })}
          required
        >
          <option value="">Select Alert Type</option>
          <option value="boil_notice">Boil Notice</option>
          <option value="contamination">Contamination</option>
          <option value="outage">Outage</option>
        </select>

        <input
          placeholder="Station ID"
          onChange={e => setForm({ ...form, station_id: e.target.value })}
          required
        />

        <input
          placeholder="Location"
          onChange={e => setForm({ ...form, location: e.target.value })}
          required
        />

        <textarea
          placeholder="Message"
          onChange={e => setForm({ ...form, message: e.target.value })}
          required
        />

        <button type="submit">Create Alert</button>
      </form>

      {/* Pie Chart */}
      <div style={{ marginTop: "40px" }}>
        <PieChart width={400} height={300}>
          <Pie data={pieData} dataKey="value" outerRadius={100}>
            {pieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Alert List */}
      <div style={{ marginTop: "40px" }}>
        {alerts.map(alert => (
          <div key={alert.id} style={cardStyle}>
            <h4>{alert.alert_type}</h4>
            <p>{alert.message}</p>
            <small>{alert.location}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

const formStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
  maxWidth: "400px"
};

const cardStyle = {
  background: "#f4f6f9",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "10px"
};

export default Alert;