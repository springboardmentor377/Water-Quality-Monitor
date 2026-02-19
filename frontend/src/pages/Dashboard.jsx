import React, { useEffect, useState } from "react";
import {
  Database, FileText, Activity, AlertTriangle, Droplets,
  TrendingUp, Clock, CheckCircle, XCircle
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine
} from "recharts";
import api from "../services/api";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const ALERT_COLORS = {
  'active': '#EF4444', // Red-500
  'resolved': '#10B981', // Green-500
  'High': '#EF4444',
  'Critical': '#7F1D1D', // Red-900
  'Warning': '#F59E0B' // Amber-500
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/dashboard-data");
      setData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  const { stats, charts, latest } = data;

  // Transform box plot data for simple range visualization
  // box_plot_data = [{name: "pH", stats: {min, q1, median, q3, max}}, ...]
  const boxPlotData = charts.parameter_stats.map(item => ({
    name: item.name,
    min: item.stats.min,
    max: item.stats.max,
    median: item.stats.median,
    q1: item.stats.q1,
    q3: item.stats.q3
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400 text-sm">Overview of water quality monitoring system</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Stations"
            value={stats.total_stations}
            icon={<Database className="text-blue-500" />}
            subtext="Monitoring Points"
          />
          <StatCard
            title="Total Readings"
            value={stats.total_readings.toLocaleString()}
            icon={<Activity className="text-purple-500" />}
            subtext="Data Points Collected"
          />
          <StatCard
            title="Avg Readings/Stn"
            value={stats.avg_readings_source}
            icon={<Droplets className="text-cyan-500" />}
            subtext="Per Station"
          />
          <StatCard
            title="Avg Reports/Stn"
            value={stats.avg_reports_station}
            icon={<FileText className="text-green-500" />}
            subtext="User Contributions"
          />
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Alert Status Pie Chart */}
          <ChartCard title="Alert Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts.alert_status}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.alert_status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ALERT_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} itemStyle={{ color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Report Status Pie Chart */}
          <ChartCard title="Report Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts.report_status}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.report_status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} itemStyle={{ color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        {/* PARAMETER STATS (BOX PLOT SIMULATION) */}
        <ChartCard title="Parameter Statistics (Min - Median - Max)">
          <div className="space-y-6 mt-4">
            {boxPlotData.map((param) => (
              <div key={param.name} className="space-y-2">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>{param.name}</span>
                  <span>Median: {param.median}</span>
                </div>
                <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
                  {/* Background track representing range could be added if limits known */}

                  {/* The Range Bar */}
                  <div
                    className="absolute h-full bg-blue-500/30 rounded-full"
                    style={{
                      left: '0%',
                      width: '100%' // Simplified for demo, ideally scaled
                    }}
                  ></div>

                  {/* Markers for Min, Median, Max - Using absolute positioning based on a scale would be better, 
                        but for now displaying simple visual bars */}
                  <div className="flex items-center h-full w-full px-2">
                    <div className="w-full flex justify-between text-xs text-slate-400">
                      <span>Min: {param.min}</span>
                      <span className="font-bold text-white">Med: {param.median}</span>
                      <span>Max: {param.max}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {boxPlotData.length === 0 && <p className="text-slate-500">No parameter data available.</p>}
          </div>
        </ChartCard>

        {/* LATEST LISTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Latest Alerts */}
          <ListCard title="Latest Alerts" icon={<AlertTriangle className="text-red-500" />}>
            {latest.alerts.length === 0 ? (
              <p className="text-slate-500">No active alerts.</p>
            ) : (
              latest.alerts.map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className={`mt-1 h-2 w-2 rounded-full ${ALERT_COLORS[alert.level] || 'bg-blue-500'}`}></div>
                  <div>
                    <p className="font-semibold text-sm text-slate-200">{alert.message}</p>
                    <div className="flex gap-2 text-xs text-slate-500 mt-1">
                      <span>{alert.station_name}</span>
                      <span>•</span>
                      <span>{alert.created_at}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ListCard>

          {/* Latest Reports */}
          <ListCard title="Latest Reports" icon={<FileText className="text-blue-500" />}>
            {latest.reports.length === 0 ? (
              <p className="text-slate-500">No recent reports.</p>
            ) : (
              latest.reports.map(report => (
                <div key={report.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="mt-1">
                    {report.status === 'verified' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-200">{report.description}</p>
                    <div className="flex gap-2 text-xs text-slate-500 mt-1">
                      <span>{report.location}</span>
                      <span>•</span>
                      <span className="capitalize">{report.status}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ListCard>

        </div>

      </div>
    </div>
  );
}

// Sub-components

function StatCard({ title, value, icon, subtext }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-md rounded-2xl p-6 transition-all hover:bg-slate-900/70">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</span>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="text-xs text-slate-500 mt-1">{subtext}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-md rounded-2xl p-6">
      <h3 className="text-lg font-bold mb-6 text-slate-200">{title}</h3>
      {children}
    </div>
  );
}

function ListCard({ title, icon, children }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-md rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h3 className="text-lg font-bold text-slate-200">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}