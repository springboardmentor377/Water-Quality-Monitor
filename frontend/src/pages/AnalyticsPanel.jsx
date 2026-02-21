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

  const data = [
    { month: "Jan", pH: 7.2, turbidity: 2.1, contamination: 0.01 },
    { month: "Feb", pH: 7.0, turbidity: 2.0, contamination: 0.02 },
    { month: "Mar", pH: 6.8, turbidity: 1.9, contamination: 0.03 },
    { month: "Apr", pH: 7.1, turbidity: 2.2, contamination: 0.01 },
  ];

  const pieData = [
    { name: "pH", value: 40 },
    { name: "Turbidity", value: 35 },
    { name: "Contamination", value: 25 },
  ];

  const COLORS = ["#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <div className="grid grid-cols-3 gap-6">

      {/* Line Graph */}
      <div className="col-span-2 bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Water Quality Trends</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="pH"
              stroke="#3b82f6"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="turbidity"
              stroke="#f59e0b"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="contamination"
              stroke="#ef4444"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Water Quality Distribution</h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default AnalyticsPanel;