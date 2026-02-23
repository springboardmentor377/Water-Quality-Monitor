<<<<<<< HEAD
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!role) {
      alert("Please select a role");
      return;
    }

    try {
      // Auto-generate name based on role since field is removed
      const name = role.charAt(0).toUpperCase() + role.slice(1) + " User";
      await api.post("/register", { name, email, password, role });
      alert("User created successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      let errorMsg = "Failed to create user";

      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          errorMsg = detail.map(e => e.msg).join(", ");
        } else if (typeof detail === "string") {
          errorMsg = detail;
        }
      }

      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create New User</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Role</label>
            <select
              className="w-full bg-slate-900 text-white rounded-lg border border-slate-700 px-4 py-3 focus:outline-none focus:border-blue-500"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="ngo">NGO</option>
              <option value="authority">Authority</option>
              <option value="citizen">Citizen</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Email</label>
            <input
              className="w-full bg-slate-900 text-white rounded-lg border border-slate-700 px-4 py-3 focus:outline-none focus:border-blue-500"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Password</label>
            <div className="relative">
              <input
                className="w-full bg-slate-900 text-white rounded-lg border border-slate-700 px-4 py-3 focus:outline-none focus:border-blue-500 pr-10"
                type={isVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white focus:outline-none"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.414-1.414A9 9 0 002 10c0-2.008.797-3.873 2.122-5.323l-1.415-1.384zM10 4a6 6 0 015.32 3.253l2.256-2.256A8.966 8.966 0 0010 2zM15.342 13.928l-2.028-2.029A4 4 0 0010 6a4.015 4.015 0 00-1.414.257l2.115 2.115a2 2 0 012.641 2.641zM2.548 10a8 8 0 0011.109 4.39l-1.503-1.503A5.962 5.962 0 0110 16a6 6 0 01-5.32-3.253A7.962 7.962 0 012.548 10z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Must be 8+ chars with uppercase, lowercase & number
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
=======
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", { name, email, password });
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input placeholder="Name" onChange={e => setName(e.target.value)} /><br /><br />
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} /><br /><br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
>>>>>>> origin/main
