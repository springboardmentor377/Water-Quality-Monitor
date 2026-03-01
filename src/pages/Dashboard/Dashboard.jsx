import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import MapView from './MapView';
import Analytics from './Analytics';

const Dashboard = ()=> (
  <div className="flex-1 min-h-screen">
    <Navbar />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><div className="card card-full h-96"><MapView /></div></div>
          <div><div className="card h-96"><Analytics /></div></div>
        </div>
      </main>
    </div>
  </div>
);

export default Dashboard;
