import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth() || {};
  if (!user) return <Navigate to="/login" replace />;
  if (roles && roles.length>0) {
    const role = user.role || user?.roles?.[0];
    if (!roles.includes(role)) return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default ProtectedRoute;
