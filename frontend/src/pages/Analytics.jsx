
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [trendData, setTrendData] = useState([]);
  const [stationId, setStationId] = useState('');
  const [parameter, setParameter] = useState('pH');

  useEffect(() => {
    if (stationId) {
      api.get(`/analytics/trends?station_id=${stationId}&parameter=${parameter}`)
        .then(res => setTrendData(res.data));
    }
  }, [stationId, parameter]);

  const chartData = {
    labels: trendData.map(d => new Date(d.recorded_at).toLocaleString()),
    datasets: [
      {
        label: parameter,
        data: trendData.map(d => d.value),
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Analytics & Trends</h2>
      <div className="mb-4 flex gap-2">
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Station ID"
          value={stationId}
          onChange={e => setStationId(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={parameter}
          onChange={e => setParameter(e.target.value)}
        >
          <option value="pH">pH</option>
          <option value="turbidity">Turbidity</option>
          <option value="DO">DO</option>
          <option value="lead">Lead</option>
          <option value="arsenic">Arsenic</option>
        </select>
      </div>
      {trendData.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <div className="text-gray-500">No data to display</div>
      )}
    </div>
  );
};

export default Analytics;
