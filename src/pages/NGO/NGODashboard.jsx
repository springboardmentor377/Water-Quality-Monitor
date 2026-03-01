import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const NGODashboard = ()=> (
  <div className="flex-1 min-h-screen">
    <Navbar />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">NGO Dashboard</h1>
        <div className="bg-white p-4 rounded shadow">NGO tools placeholder.</div>
      </main>
    </div>
  </div>
);

export default NGODashboard;
