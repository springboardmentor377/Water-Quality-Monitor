import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("citizen");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Login
      const formData = new URLSearchParams();
      formData.append("username", email.trim());
      formData.append("password", password);

      const res = await api.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Save token
      localStorage.setItem("token", res.data.access_token);

      // Decode and verify role
      try {
        const payload = JSON.parse(atob(res.data.access_token.split(".")[1]));

        // Verify role matches selection
        if (payload.role !== selectedRole) {
          // Optional: clear token if mismatch? For now just error.
          localStorage.removeItem("token");
          throw new Error(`Access denied. You are not a ${selectedRole.toUpperCase()}.`);
        }

        localStorage.setItem("role", payload.role);
      } catch (e) {
        console.error("Error decoding token or verifying role:", e);
        throw e; // Re-throw to be caught below
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Auth error:", err);

      let errorMsg = "Login failed";

      if (err.message && err.message.includes("Access denied")) {
        errorMsg = err.message;
      } else if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          errorMsg = detail
            .map((e) => e.msg || e.detail || JSON.stringify(e))
            .join(", ");
        } else if (typeof detail === "string") {
          errorMsg = detail;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Water Quality Monitor
          </h1>
          <h2 className="text-xl font-semibold text-gray-700">
            Welcome Back
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login As
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={loading}
            >
              <option value="citizen">Citizen</option>
              <option value="ngo">NGO</option>
              <option value="authority">Authority</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
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
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-3 rounded-lg text-white font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Please wait...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;