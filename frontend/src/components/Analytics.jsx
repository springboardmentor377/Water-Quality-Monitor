import { useEffect, useState } from "react";

const API = "http://localhost:8000";

function Analytics() {
  const [stations, setStations] = useState([]);
  const [readings, setReadings] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState("pH");
  const [dateRange, setDateRange] = useState("7days");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (selectedStation) {
      fetchReadings(selectedStation);
    }
  }, [selectedStation]);

  const fetchStations = async () => {
    try {
      const res = await fetch(`${API}/stations/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStations(data);
      if (data.length > 0) {
        setSelectedStation(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch stations", err);
    }
  };

  const fetchReadings = async (stationId) => {
    try {
      const res = await fetch(`${API}/stations/${stationId}/readings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReadings(data);
    } catch (err) {
      console.error("Failed to fetch readings", err);
    }
  };

  const getFilteredReadings = () => {
    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    return readings
      .filter((r) => {
        const readingDate = new Date(r.recorded_at);
        return readingDate >= startDate && r.parameter === selectedParameter;
      })
      .sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
  };

  const calculateStats = () => {
    const filtered = getFilteredReadings();
    if (filtered.length === 0) return { min: 0, max: 0, avg: 0 };

    const values = filtered.map((r) => parseFloat(r.value));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);

    return { min: min.toFixed(2), max: max.toFixed(2), avg };
  };

  const THRESHOLDS = {
    pH: 8.5,
    DO: 4.0,
    turbidity: 10.0,
    lead: 0.015,
    arsenic: 0.01,
  };

  const filteredReadings = getFilteredReadings();
  const stats = calculateStats();

  const chartHeight = Math.max(...filteredReadings.map((r) => parseFloat(r.value)), THRESHOLDS[selectedParameter] || 0, 10);
  const thresholdValue = THRESHOLDS[selectedParameter];

  const selectStyle = {
    padding: "9px 14px",
    border: "1px solid var(--border-subtle)",
    borderRadius: "8px",
    fontSize: "13px",
    color: "var(--text-primary)",
    fontWeight: "500",
    background: "var(--bg-glass)",
    cursor: "pointer",
    transition: "all 0.25s ease",
    outline: "none",
  };

  return (
    <div className="page-container">
      <h2 className="page-header">
        <span>📊</span> Water Quality Analytics
      </h2>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <select
          value={selectedStation || ""}
          onChange={(e) => setSelectedStation(parseInt(e.target.value))}
          style={selectStyle}
        >
          {stations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={selectedParameter}
          onChange={(e) => setSelectedParameter(e.target.value)}
          style={selectStyle}
        >
          <option value="pH">pH</option>
          <option value="DO">Dissolved Oxygen</option>
          <option value="turbidity">Turbidity</option>
          <option value="lead">Lead</option>
          <option value="arsenic">Arsenic</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={selectStyle}
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "📉 Minimum", value: stats.min, color: "#6366f1" },
          { label: "📈 Maximum", value: stats.max, color: "#f59e0b" },
          { label: "📊 Average", value: stats.avg, color: "#06d6a0" },
          { label: "🔢 Data Points", value: filteredReadings.length, color: "#ec4899" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {s.label}
            </div>
            <div style={{ fontSize: "28px", fontWeight: "700", color: s.color, margin: "6px 0" }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card" style={{ padding: "20px", marginBottom: "20px" }}>
        <h3 style={{ color: "var(--text-primary)", marginBottom: "16px", marginTop: 0, fontWeight: "700" }}>
          Trend Chart — {selectedParameter}
        </h3>

        {filteredReadings.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>No data available for selected period</p>
        ) : (
          <div style={{ overflowX: "auto", minHeight: "300px", position: "relative" }}>
            <svg
              width="100%"
              height="300"
              style={{ minWidth: "600px" }}
            >
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => (
                <line
                  key={`grid-${i}`}
                  x1="50"
                  y1={300 - percent * 250}
                  x2="100%"
                  y2={300 - percent * 250}
                  stroke="rgba(255,255,255,0.04)"
                  strokeDasharray="5,5"
                />
              ))}

              {/* Threshold line */}
              {thresholdValue != null && (
                <>
                  <line
                    x1="50"
                    y1={50 + (1 - thresholdValue / chartHeight) * 250}
                    x2="100%"
                    y2={50 + (1 - thresholdValue / chartHeight) * 250}
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="8,4"
                  />
                  <text
                    x="55"
                    y={50 + (1 - thresholdValue / chartHeight) * 250 - 6}
                    fill="#ef4444"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="Inter, sans-serif"
                  >
                    Threshold: {thresholdValue}
                  </text>
                </>
              )}

              {/* Data line */}
              <polyline
                points={filteredReadings
                  .map((r, i) => {
                    const x = 50 + (i / (filteredReadings.length - 1)) * (Math.max(0, document.body.offsetWidth - 150));
                    const y = 50 + (1 - parseFloat(r.value) / chartHeight) * 250;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#06d6a0"
                strokeWidth="2.5"
              />

              {/* Gradient area fill */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06d6a0" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#06d6a0" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Data points */}
              {filteredReadings.map((r, i) => {
                const x = 50 + (i / (filteredReadings.length - 1)) * (Math.max(0, document.body.offsetWidth - 150));
                const y = 50 + (1 - parseFloat(r.value) / chartHeight) * 250;
                return (
                  <circle
                    key={`point-${i}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#06d6a0"
                    stroke="var(--bg-primary)"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Reading History Table */}
      <div className="glass-card" style={{ padding: "20px" }}>
        <h3 style={{ color: "var(--text-primary)", marginBottom: "12px", marginTop: 0, fontWeight: "700" }}>
          Reading History
        </h3>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {filteredReadings.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No readings available</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <th style={{ textAlign: "left", padding: "10px", color: "var(--accent)", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Date & Time
                  </th>
                  <th style={{ textAlign: "left", padding: "10px", color: "var(--accent)", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReadings.slice(-20).reverse().map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.2s" }}>
                    <td style={{ padding: "10px", color: "var(--text-secondary)", fontSize: "13px" }}>
                      {new Date(r.recorded_at).toLocaleString()}
                    </td>
                    <td style={{ padding: "10px", color: "var(--accent)", fontWeight: "600", fontSize: "14px" }}>
                      {r.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
