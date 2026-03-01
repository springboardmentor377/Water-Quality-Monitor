import { NavLink } from "react-router-dom";
import "./Navbar.css";

interface NavbarProps {
  user?: string;
}

export default function Navbar({ user = "admin (admin@123)" }: NavbarProps) {
  return (
    <div className="navbar-container">
      <div className="navbar">

        {/* LEFT */}
        <div className="navbar-left">
          <div className="logo-circle">
            ⚛
          </div>

          <div className="logo-text">
            <h1>Water Quality Monitor</h1>
            <p>Environmental Intelligence</p>
          </div>
        </div>

        {/* CENTER */}
        <div className="navbar-center">
          User logged in: <strong>{user}</strong>
        </div>

        {/* RIGHT */}
        <div className="navbar-right">
          <NavLink to="/dashboard/map" className="nav-btn">Map</NavLink>
          <NavLink to="/dashboard/reports" className="nav-btn">View Report</NavLink>
          <NavLink to="/dashboard/create-report" className="nav-btn">Create Report</NavLink>
          <NavLink to="/dashboard/alert" className="nav-btn">Alert</NavLink>
        </div>

      </div>
    </div>
  );
}
