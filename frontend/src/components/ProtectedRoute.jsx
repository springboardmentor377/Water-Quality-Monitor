<<<<<<< HEAD
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../services/auth";

function ProtectedRoute({ children, roles }) {
  // Check if user is authenticated (with valid, non-expired token)
  if (!isAuthenticated()) {
    console.log("Not authenticated - redirecting to login");
    return <Navigate to="/" replace />;
  }

  // Check role-based access if roles are specified
  if (roles && roles.length > 0) {
    const userRole = getUserRole();
    
    if (!userRole || !roles.includes(userRole)) {
      console.log(`Access denied - user role '${userRole}' not in allowed roles:`, roles);
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and authorized
  return children;
}

export default ProtectedRoute;
=======
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // save role on login

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
>>>>>>> origin/main
