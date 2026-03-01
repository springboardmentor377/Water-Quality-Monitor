import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
const Navbar = ()=>{ const { user, logout } = useAuth() || {}; return (
  <header className="bg-gradient-to-r from-sky-600 to-indigo-600 shadow">
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="font-bold text-xl text-white">Water Quality Monitor</Link>
      <div>{user? (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-white/90">{user.username||user.email||'User'}</span>
          <button onClick={logout} className="px-3 py-1 bg-white text-sky-600 rounded">Logout</button>
        </div>
      ) : (
        <Link to="/login" className="text-sm text-white/90">Login</Link>
      )}</div>
    </div>
  </header>
);
};
export default Navbar;
