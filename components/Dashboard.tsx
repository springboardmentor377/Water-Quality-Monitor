import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);
  const [waterQualityData, setWaterQualityData] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    // Dashboard Stats
    axios.get("http://127.0.0.1:8000/dashboard", config)
      .then(res => {
        const data = res.data;

        setStats([
          { title: "🌊 Water Stations", value: data.total_stations || 40, color: "#0088FE" },
          { title: "📊 Total Readings", value: data.total_readings || 850, color: "#00C49F" },
          { title: "📝 Reports", value: data.total_reports || 85, color: "#FFBB28" },
          { title: "🚨 Active Alerts", value: data.total_alerts || 12, color: "#FF8042" },
        ]);
      })
      .catch(err => {
        console.log("Dashboard API error:", err);
        setStats([
          { title: "🌊 Water Stations", value: 40, color: "#0088FE" },
          { title: "📊 Total Readings", value: 1250, color: "#00C49F" },
          { title: "📝 Reports", value: 85, color: "#FFBB28" },
          { title: "🚨 Active Alerts", value: 12, color: "#FF8042" },
        ]);
      });

    // Alerts
    axios.get("http://127.0.0.1:8000/alerts", config)
      .then(res => setAlerts(res.data))
      .catch(err => {
        console.log("Alerts API error:", err);
        setAlerts([]);
      });

    // Reports
    axios.get("http://127.0.0.1:8000/reports", config)
      .then(res => {
        setReports(res.data);

        // Status Pie Data
        const pending = res.data.filter((r: any) => r.status === "pending").length;
        const verified = res.data.filter((r: any) => r.status === "verified").length;
        const rejected = res.data.filter((r: any) => r.status === "rejected").length;

        setStatusData([
          { name: "Pending", value: pending, color: "#FFBB28" },
          { name: "Verified", value: verified, color: "#00C49F" },
          { name: "Rejected", value: rejected, color: "#FF8042" },
        ]);
      })
      .catch(err => {
        console.log("Reports API error:", err);
        setReports([]);
        setStatusData([
          { name: "Pending", value: 25, color: "#FFBB28" },
          { name: "Verified", value: 45, color: "#00C49F" },
          { name: "Rejected", value: 15, color: "#FF8042" },
        ]);
      });

    // Station Readings (Example station 1)
    axios.get("http://127.0.0.1:8000/waterstation-readings/1", config)
      .then(res => {
        const formatted = res.data.map((r: any, index: number) => ({
          time: `Day ${index + 1}`,
          pH: r.parameter === 'pH' ? r.value : 7.2,
          turbidity: r.parameter === 'turbidity' ? r.value : 5.5,
          dissolved_oxygen: r.parameter === 'DO' ? r.value : 8.1,
        }));
        setLineData(formatted.slice(-7)); // last 7 days
      })
      .catch(err => {
        console.log("Station readings API error:", err);
        // Mock data for demonstration
        setLineData([
          { time: 'Day 1', pH: 7.2, turbidity: 5.5, dissolved_oxygen: 8.1 },
          { time: 'Day 2', pH: 7.1, turbidity: 5.8, dissolved_oxygen: 7.9 },
          { time: 'Day 3', pH: 7.3, turbidity: 5.2, dissolved_oxygen: 8.2 },
          { time: 'Day 4', pH: 7.0, turbidity: 6.1, dissolved_oxygen: 7.8 },
          { time: 'Day 5', pH: 7.2, turbidity: 5.6, dissolved_oxygen: 8.0 },
          { time: 'Day 6', pH: 7.4, turbidity: 5.3, dissolved_oxygen: 8.3 },
          { time: 'Day 7', pH: 7.1, turbidity: 5.7, dissolved_oxygen: 8.1 },
        ]);
      });

    // Water Quality Distribution
    setWaterQualityData([
      { name: "Excellent", value: 15, color: "#00C49F" },
      { name: "Good", value: 18, color: "#0088FE" },
      { name: "Moderate", value: 5, color: "#FFBB28" },
      { name: "Poor", value: 2, color: "#FF8042" },
    ]);

  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>💧 Water Quality Monitor Dashboard</h1>
        <p>Real-time water quality monitoring and analysis</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.title.split(' ')[0]}
            </div>
            <div className="stat-content">
              <h3>{stat.title.split(' ').slice(1).join(' ')}</h3>
              <p className="stat-number">{stat.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Report Status Pie Chart */}
        <div className="chart-container">
          <h3>📊 Report Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Water Quality Distribution */}
        <div className="chart-container">
          <h3>💧 Water Quality Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={waterQualityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE">
                {waterQualityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Water Quality Trends */}
      <div className="chart-container full-width">
        <h3>📈 Water Quality Trends (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={lineData}>
            <XAxis dataKey="time" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pH" stroke="#0088FE" strokeWidth={2} />
            <Line type="monotone" dataKey="turbidity" stroke="#00C49F" strokeWidth={2} />
            <Line type="monotone" dataKey="dissolved_oxygen" stroke="#FFBB28" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="activity-grid">
        {/* Recent Alerts */}
        <div className="activity-card">
          <h3>🚨 Recent Alerts</h3>
          <div className="activity-list">
            {alerts.slice(0, 5).map((alert: any, index: number) => (
              <div 
                key={index} 
                className="activity-item" 
                onClick={() => navigate("/dashboard/alerts")}
                style={{ cursor: "pointer" }}
              >
                <div className="activity-icon">🚨</div>
                <div className="activity-content">
                  <p className="activity-title">{alert.message || 'High turbidity detected'}</p>
                  <p className="activity-time">{alert.severity || 'Medium'} • {alert.location || 'Delhi'}</p>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="no-data">No recent alerts</p>
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="activity-card">
          <h3>📝 Recent Reports</h3>
          <div className="activity-list">
            {reports.slice(0, 5).map((report: any, index: number) => (
              <div 
                key={index} 
                className="activity-item" 
                onClick={() => navigate("/dashboard/reports")}
                style={{ cursor: "pointer" }}
              >
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                  <p className="activity-title">{report.description || 'Water contamination reported'}</p>
                  <p className="activity-time">{report.status || 'pending'} • {report.water_source || 'River'}</p>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <p className="no-data">No recent reports</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
