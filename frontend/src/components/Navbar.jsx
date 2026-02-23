<<<<<<< HEAD
import { useNavigate, useLocation } from "react-router-dom";
import { logout, getUserRole, getUserEmail } from "../services/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = getUserRole();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navButtonClass = (path) => {
    return `px-4 py-2 rounded-lg font-medium transition-colors ${isActive(path)
      ? "bg-blue-700 text-white"
      : "bg-blue-600 text-white hover:bg-blue-700"
      }`;
  };

  return (
    <div className="bg-blue-900 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {/* Logo Removed */}
          <h1 className="font-bold text-xl leading-tight">Water Quality Monitor</h1>

          {role && (
            <div className="flex flex-col text-xs mt-0.5 border-l border-blue-700 pl-4">
              <span className="text-blue-200 uppercase font-semibold tracking-wider text-[20px]">{role}</span>
              <span className="text-blue-100/80">{getUserEmail()}</span>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className={navButtonClass("/dashboard")}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => navigate("/map")}
            className={navButtonClass("/map")}
          >
            🗺️ Map View
          </button>

          <button
            onClick={() => navigate("/reports")}
            className={navButtonClass("/reports")}
          >
            📋 Reports
          </button>

          {role === "citizen" && (
            <button
              onClick={() => navigate("/report")}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ➕ New Report
            </button>
          )}


          {role === "admin" && (
            <button
              onClick={() => navigate("/register")}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors ml-2"
            >
              👤 Create User
            </button>
          )}

          {/* NGO Projects Link */}
          {role === "ngo" && (
            <button
              onClick={() => navigate("/ngo")}
              className={navButtonClass("/ngo")}
            >
              🤝 NGO Projects
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group flex items-center bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg font-medium transition-colors ml-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap ml-0 group-hover:ml-2">
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
=======
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate(); // ✅ INSIDE component

  return (
    <div className="flex justify-between items-center bg-blue-900 text-white px-6 py-3">
      <h1 className="font-semibold text-lg">Water Quality Monitor</h1>

      <div className="space-x-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 px-3 py-1 rounded"
        >
          Map
        </button>

        <button
          onClick={() => navigate("/reports")}
          className="bg-blue-600 px-3 py-1 rounded"
        >
          View Report
        </button>

        <button
          onClick={() => navigate("/report")}
          className="bg-green-600 px-3 py-1 rounded"
        >
          Create Report
        </button>
      </div>
    </div>
  );
}
>>>>>>> origin/main
