import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {

  const role = localStorage.getItem("role");
  const userEmail = localStorage.getItem("user_email");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="navbar-container">
      <div className="navbar">

        {/* LEFT SECTION */}
        <div className="navbar-left">
          <div className="logo-circle">💧</div>

          <div className="logo-text">
            <h1>Water Quality Monitor</h1>
            <p>Environmental Intelligence</p>
          </div>
        </div>

        {/* CENTER SECTION */}
        <div className="navbar-center">
          Logged in as: <b>{role}</b> ({userEmail})
        </div>

        {/* RIGHT SECTION */}
        <div className="navbar-right">

          <NavLink
            to="/dashboard"
            className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/map"
            className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")}
          >
            Map
          </NavLink>

          <NavLink
            to="/dashboard/alerts"
            className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")}
          >
            Alerts
          </NavLink>

          <NavLink
            to="/dashboard/reports"
            className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")}
          >
            Reports
          </NavLink>

          <NavLink
            to="/dashboard/create-report"
            className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")}
          >
            Create Report
          </NavLink>

          <NavLink
            to="/dashboard/ngo-collaboration"
            className={({ isActive }) => "nav-btn" + (isActive ? " active" : "")}
          >
            NGO Hub
          </NavLink>

          <button
            onClick={handleLogout}
            className="nav-btn"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}
