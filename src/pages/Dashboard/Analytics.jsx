import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const sampleData = [ { time:'2026-02-14', ph:7.1, turbidity:1.2, do:6.1 }, { time:'2026-02-15', ph:6.9, turbidity:1.5, do:5.9 }, { time:'2026-02-16', ph:7.3, turbidity:0.9, do:6.4 }];

const Analytics = ()=> (
  <div>
    <h3 className="font-semibold mb-2 text-gray-800">Historical Parameters</h3>
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={sampleData}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ph" stroke="var(--brand-600)" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="turbidity" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="do" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default Analytics;
