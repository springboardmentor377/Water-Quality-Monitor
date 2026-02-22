import { useEffect, useState } from "react"
import axios from "axios"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"]

export default function Analytics() {
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get("http://localhost:8000/stations/analytics/summary")
      .then(res => setData(res.data))
      .catch(err => console.error(err))
  }, [])

  if (!data) return <p className="p-6">Loading analytics...</p>

  const summaryData = [
    { name: "Stations", value: data.total_stations },
    { name: "Readings", value: data.total_readings },
    { name: "Alerts", value: data.total_alerts },
  ]

  const pieData = [
    { name: "Contamination", value: data.contamination_alerts },
    { name: "Other Alerts", value: data.total_alerts - data.contamination_alerts }
  ]

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-slate-700">
        Water System Analytics Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded-xl">
          <p className="text-sm text-gray-500">Total Stations</p>
          <p className="text-2xl font-bold">{data.total_stations}</p>
        </div>

        <div className="bg-white shadow p-4 rounded-xl">
          <p className="text-sm text-gray-500">Total Readings</p>
          <p className="text-2xl font-bold">{data.total_readings}</p>
        </div>

        <div className="bg-white shadow p-4 rounded-xl">
          <p className="text-sm text-gray-500">Total Alerts</p>
          <p className="text-2xl font-bold">{data.total_alerts}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">

        {/* Pie Chart */}
        <div className="bg-white shadow p-4 rounded-xl">
          <h3 className="font-semibold mb-4">Alert Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow p-4 rounded-xl">
          <h3 className="font-semibold mb-4">System Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summaryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}