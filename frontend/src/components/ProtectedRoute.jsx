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
