import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ReportList from './pages/Reports/ReportList';
import ReportForm from './pages/Reports/ReportForm';
import Alerts from './pages/Alerts/Alerts';
import NGODashboard from './pages/NGO/NGODashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/reports" element={<ProtectedRoute><ReportList /></ProtectedRoute>} />
        <Route path="/reports/new" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
        <Route path="/ngo-dashboard" element={<ProtectedRoute roles={["ngo","admin"]}><NGODashboard /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
