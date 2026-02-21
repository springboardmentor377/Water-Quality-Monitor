import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

function Analytics() {
  const [stations, setStations] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/stations/")
      .then(res => res.json())
      .then(data => setStations(Array.isArray(data) ? data : []));

    fetch("http://localhost:8000/alerts/")
      .then(res => res.json())
      .then(data => setAlerts(Array.isArray(data) ? data : []));
  }, []);

  // Calculate Safe & Contaminated
  const safeCount = stations.filter(s =>
    !(
      (s.parameter === "pH" && (s.value < 6.5 || s.value > 8.5)) ||
      (s.parameter === "lead" && s.value > 0.01)
    )
  ).length;

  const contaminatedCount = stations.length - safeCount;

  // Pie Data
  const pieData = [
    { name: "Safe", value: safeCount },
    { name: "Contaminated", value: contaminatedCount }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  // Bar Chart Data
  const alertTypes = ["boil_notice", "contamination", "outage"];
  const barData = alertTypes.map(type => ({
    type,
    count: alerts.filter(a => a.type === type).length
  }));

  // Line Chart (Mock Trend Data)
  const trendData = [
    { month: "Jan", pH: 7.2 },
    { month: "Feb", pH: 7.0 },
    { month: "Mar", pH: 6.8 },
    { month: "Apr", pH: 6.5 },
    { month: "May", pH: 6.2 },
    { month: "Jun", pH: 6.0 }
  ];

  // Predictive Risk Logic
  const contaminationRate =
    stations.length > 0
      ? (contaminatedCount / stations.length) * 100
      : 0;

  let riskLevel = "Low Risk";
  if (contaminationRate > 40) riskLevel = "High Risk";
  else if (contaminationRate > 20) riskLevel = "Medium Risk";

  return (
    <div style={{ padding: "30px" }}>
      <h2>📊 Water Quality Analytics</h2>

      {/* Risk Panel */}
      <div
        style={{
          backgroundColor:
            riskLevel === "High Risk"
              ? "#fee2e2"
              : riskLevel === "Medium Risk"
              ? "#fef9c3"
              : "#dcfce7",
          padding: "15px",
          borderRadius: "10px",
          marginTop: "20px",
          fontWeight: "600"
        }}
      >
        🔮 Predictive Risk Assessment: {riskLevel}
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginTop: "30px"
        }}
      >
        {/* Pie Chart */}
        <div style={{ height: "300px" }}>
          <h3>Safe vs Contaminated</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={{ height: "300px" }}>
          <h3>Alerts by Type</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div style={{ height: "350px", marginTop: "40px" }}>
        <h3>pH Trend Over Time</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[5, 9]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pH"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;