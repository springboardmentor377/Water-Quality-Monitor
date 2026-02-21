import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

function AnalyticsPanel() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [readings, setReadings] = useState([]);

  // Fetch stations
  useEffect(() => {
    fetch("http://localhost:8000/stations/")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStations(data);
          setSelectedStation(data[0].id);
        }
      });
  }, []);

  // Fetch readings when station changes
  useEffect(() => {
    if (!selectedStation) return;

    fetch(`http://localhost:8000/stations/readings/${selectedStation}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReadings(data);
        }
      });
  }, [selectedStation]);

  // Group data by date for line graph
  const grouped = {};

  readings.forEach(r => {
    const date = new Date(r.recorded_at)
      .toISOString()
      .split("T")[0];

    if (!grouped[date]) {
      grouped[date] = {
        date: date,
        pH: null,
        turbidity: null,
        contamination: null
      };
    }

    if (r.parameter === "pH") {
      grouped[date].pH = r.value;
    }

    if (r.parameter === "turbidity") {
      grouped[date].turbidity = r.value;
    }

    if (r.parameter === "lead") {
      grouped[date].contamination = r.value;
    }
  });

  const graphData = Object.values(grouped).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Pie Chart Data
  const pieData = [
    {
      name: "pH",
      value: readings.filter(r => r.parameter === "pH").length
    },
    {
      name: "Turbidity",
      value: readings.filter(r => r.parameter === "turbidity").length
    },
    {
      name: "Contamination",
      value: readings.filter(r => r.parameter === "lead").length
    }
  ];

  const COLORS = ["#2563eb", "#f59e0b", "#ef4444"];

  return (
    <div style={{ padding: "30px" }}>

      {/* Station Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "500" }}>
          Select Station:
        </label>
        <select
          value={selectedStation || ""}
          onChange={(e) => setSelectedStation(Number(e.target.value))}
          style={{ padding: "6px 10px" }}
        >
          {stations.map(st => (
            <option key={st.id} value={st.id}>
              {st.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>

        {/* Line Chart */}
        <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
          <h3>Water Quality Trends (Day-by-Day)</h3>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="pH"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="turbidity"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="contamination"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
          <h3>Parameter Distribution</h3>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={120}
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

      </div>
    </div>
  );
}

export default AnalyticsPanel;