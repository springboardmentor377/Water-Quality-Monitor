import React from 'react';
import { NavLink } from 'react-router-dom';
const Sidebar = ()=> (
  <aside className="w-64 bg-white border-r h-full sticky top-0">
    <nav className="p-4 space-y-2">
      <NavLink to="/dashboard" className={({isActive})=>`block px-3 py-2 rounded ${isActive? 'bg-sky-50 text-sky-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
        Dashboard
      </NavLink>
      <NavLink to="/reports" className={({isActive})=>`block px-3 py-2 rounded ${isActive? 'bg-sky-50 text-sky-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
        Reports
      </NavLink>
      <NavLink to="/alerts" className={({isActive})=>`block px-3 py-2 rounded ${isActive? 'bg-sky-50 text-sky-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
        Alerts
      </NavLink>
    </nav>
  </aside>
);
export default Sidebar;
