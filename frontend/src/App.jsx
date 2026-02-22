import { useState, useEffect } from "react";
import StationMap from "./components/StationMap";
import Stations from "./components/Stations";
import Reports from "./components/Reports";
import ReportForm from "./components/ReportForm";
import Alerts from "./components/Alerts";
import StationHistory from "./components/StationHistory";
import NGODashboard from "./components/NGODashboard";
import Analytics from "./components/Analytics";


export default function App() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("citizen");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardView, setDashboardView] = useState("map");

  /* ================= AUTH FUNCTIONS ================= */

  const login = async () => {
    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Login failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      loadUser();
    } catch {
      alert("Backend not reachable");
    }
    setLoading(false);
  };

  const register = async () => {
    if (!name || !email || !password || !location) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          location,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Registration failed");
        setLoading(false);
        return;
      }

      alert("Registration successful. Please login.");
      setActiveTab("login");
    } catch {
      alert("Backend not reachable");
    }
    setLoading(false);
  };

  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch {
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    loadUser();
  }, []);

  /* ================= DASHBOARD ================= */

  if (user) {
    return (
      <div className="min-h-screen bg-slate-100">
        {/* NAVBAR */}
        <header className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-slate-700">
            Water Quality Dashboard
          </h1>

          <div className="flex gap-2 flex-wrap">

            <button onClick={() => setDashboardView("map")}
              className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">
              Map
            </button>

            <button onClick={() => setDashboardView("stations")}
              className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">
              Stations
            </button>

            <button onClick={() => setDashboardView("reports")}
              className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">
              Reports
            </button>

            <button onClick={() => setDashboardView("submit")}
              className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">
              Submit Report
            </button>


            <button onClick={() => setDashboardView("alerts")}
              className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">
              Alerts
            </button>

            {/* History only for NGO, Authority, Admin */}
            {(user.role === "ngo" ||
              user.role === "authority" ||
              user.role === "admin") && (
              <button
                onClick={() => setDashboardView("history")}
                className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">
                History
              </button>
            )}

            {/* NGO Dashboard only for NGO & Admin */}
            {(user.role === "ngo" || user.role === "admin") && (

            <button
            onClick={() => setDashboardView("ngo")}
            className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">
            NGO Dashboard
            </button>
            )}

             {/* Analytics */}
            <button
            onClick={() => setDashboardView("analytics")}
            className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">
            Analytics
            </button>

            <div className="flex items-center gap-4 ml-4">
              <div className="text-sm text-slate-700">
                <span className="font-semibold">{user.email}</span>{" "}
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                  {user.role}
                </span>
              </div>

              <button
                onClick={logout}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">
                Logout
              </button>
            </div>

          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="p-6">
          {dashboardView === "map" && <StationMap />}
          {dashboardView === "stations" && <Stations />}
          {dashboardView === "reports" && <Reports />}
          {dashboardView === "submit" && (
            <ReportForm setDashboardView={setDashboardView} />
          )}
          {dashboardView === "alerts" && <Alerts />}
          {dashboardView === "history" && <StationHistory />}
          {dashboardView === "ngo" && <NGODashboard />}
          {dashboardView === "analytics" && <Analytics />}
        </main>
      </div>
    );
  }

  /* ================= AUTH PAGE ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white w-[420px] rounded-xl shadow-lg p-6">

        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab("login")}
            className={`w-1/2 py-2 ${
              activeTab === "login"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}>
            Login
          </button>

          <button
            onClick={() => setActiveTab("register")}
            className={`w-1/2 py-2 ${
              activeTab === "register"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}>
            Register
          </button>
        </div>

        {activeTab === "login" && (
          <div className="space-y-4">
            <input
              className="w-full border rounded-lg p-2"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full border rounded-lg p-2"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>
        )}

        {activeTab === "register" && (
          <div className="space-y-3">
            <input
              className="w-full border rounded-lg p-2"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full border rounded-lg p-2"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full border rounded-lg p-2"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="w-full border rounded-lg p-2"
              placeholder="Location"
              onChange={(e) => setLocation(e.target.value)}
            />
            <select
              className="w-full border rounded-lg p-2"
              onChange={(e) => setRole(e.target.value)}>
              <option value="citizen">Citizen</option>
              <option value="ngo">NGO</option>
              <option value="authority">Authority</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={register}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}