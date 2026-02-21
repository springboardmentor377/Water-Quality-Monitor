import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";


function TopBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div
      style={{
        background: "#2563eb",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <img src={logo} alt="Logo" style={{ width: "45px" }} />
        <div>
          <h2 style={{ margin: 0 }}>
            Water Quality Monitoring System
          </h2>
          <p style={{ margin: 0, fontSize: "14px" }}>
            Logged in as: {user?.email || "User"}
          </p>
        </div>
      </div>

      {/* Right Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/reports")} className="btnTop">
          Create Report
        </button>
        <button onClick={() => navigate("/reports")} className="btnTop">
          View Reports
        </button>
        <button onClick={() => navigate("/alerts")} className="btnTop">
          Alerts
        </button>
        <button onClick={() => navigate("/collaboration")} className="btnTop">
          Collaboration
        </button>
        <button onClick={() => navigate("/map")} className="btnTop">
          View Map
        </button>
      </div>
    </div>
  );
}

export default TopBar;