import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
    <div className="font-bold text-lg">WaterWatch</div>
    <div className="space-x-4">
      <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      <Link to="/map" className="hover:underline">Map</Link>
      <Link to="/reports" className="hover:underline">Reports</Link>
      <Link to="/alerts" className="hover:underline">Alerts</Link>
      <Link to="/analytics" className="hover:underline">Analytics</Link>
      <Link to="/ngo" className="hover:underline">NGO</Link>
    </div>
  </nav>
);

export default Navbar;
