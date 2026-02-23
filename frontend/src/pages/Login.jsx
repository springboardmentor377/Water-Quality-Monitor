import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("citizen");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await api.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Save token
      localStorage.setItem("token", res.data.access_token);
      // Decode JWT to get role
      const payload = JSON.parse(atob(res.data.access_token.split(".")[1]));

      // Verify role matches selection
      if (payload.role !== selectedRole) {
        throw new Error(`Access denied. You are not a ${selectedRole.toUpperCase()}.`);
      }

      localStorage.setItem("role", payload.role);
      alert("Login successful");
      navigate("/dashboard");

    } catch (err) {
      let errorMsg = "Invalid credentials";

      if (err.message && err.message.includes("Access denied")) {
        errorMsg = err.message;
      } else if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail
            .map(e => e.msg || e.detail || JSON.stringify(e))
            .join(", ");
        } else {
          errorMsg = err.response.data.detail;
        }
      }

      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Email</label>
            <input
              className="w-full bg-slate-900 text-white rounded-lg border border-slate-700 px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Password</label>
            <input
              className="w-full bg-slate-900 text-white rounded-lg border border-slate-700 px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Login As</label>
            <select
              className="w-full bg-slate-900 text-white rounded-lg border border-slate-700 px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="citizen">Citizen</option>
              <option value="ngo">NGO</option>
              <option value="authority">Authority</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
