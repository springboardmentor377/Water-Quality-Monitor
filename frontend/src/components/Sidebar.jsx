import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <aside className="bg-gray-100 w-64 min-h-screen p-4">
    <ul className="space-y-2">
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/map">Map</Link></li>
      <li><Link to="/reports">Reports</Link></li>
      <li><Link to="/alerts">Alerts</Link></li>
      <li><Link to="/analytics">Analytics</Link></li>
      <li><Link to="/ngo">NGO Dashboard</Link></li>
    </ul>
  </aside>
);

export default Sidebar;
