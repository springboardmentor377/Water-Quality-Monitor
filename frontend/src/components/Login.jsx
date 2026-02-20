import { useState } from "react";

const API = "http://localhost:8000";

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await fetch(`${API}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Invalid credentials");
        }

        localStorage.setItem("token", data.access_token);

        const meRes = await fetch(`${API}/me`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });

        const user = await meRes.json();

        if (!meRes.ok) {
          localStorage.removeItem("token");
          throw new Error(user.detail || "Failed to fetch user");
        }

        localStorage.setItem("user", JSON.stringify(user));
        onLogin();
      } else {
        const res = await fetch(`${API}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Registration failed");
        }

        setError("");
        alert("✓ Registered successfully. Please login.");
        setMode("login");
        setName("");
        setEmail("");
        setPassword("");
        setRole("citizen");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      {/* Ambient glow blobs */}
      <div style={glowBlob1} />
      <div style={glowBlob2} />

      <div style={cardStyle}>
        {/* Logo */}
        <div style={logoStyle}>💧</div>
        <h1 style={titleStyle}>WaterWatch</h1>
        <p style={subtitleStyle}>
          {mode === "login" ? "Sign in to your account" : "Create a new account"}
        </p>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {mode === "register" && (
            <>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Full Name</label>
                <input
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={inputStyle}
                >
                  <option value="citizen">👤 Citizen</option>
                  <option value="ngo">🏛️ NGO Member</option>
                  <option value="authority">👮 Authority</option>
                  <option value="admin">🔧 Admin</option>
                </select>
              </div>
            </>
          )}

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {error && (
            <div style={errorStyle}>
              <span style={{ marginRight: "6px" }}>⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...buttonStyle,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span style={{ animation: "pulse 1s infinite" }}>⏳</span> Processing...
              </span>
            ) : (
              mode === "login" ? "Sign In →" : "Create Account →"
            )}
          </button>
        </form>

        <div style={dividerStyle}>
          <span style={dividerTextStyle}>or</span>
        </div>

        <p style={switchStyle}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span style={linkStyle} onClick={() => { setMode("register"); setError(""); }}>
                Register
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span style={linkStyle} onClick={() => { setMode("login"); setError(""); }}>
                Sign in
              </span>
            </>
          )}
        </p>

        {mode === "login" && (
          <div style={credentialsStyle}>
            <div style={{ fontWeight: 600, marginBottom: "6px", color: "var(--accent)" }}>💡 Demo Credentials</div>
            <div>User: user@example.com / password123</div>
            <div>Authority: authority@example.com / password123</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Styles --- */
const pageStyle = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--bg-primary)",
  position: "relative",
  overflow: "hidden",
};

const glowBlob1 = {
  position: "absolute",
  top: "-20%",
  left: "-10%",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(6,214,160,0.12) 0%, transparent 70%)",
  pointerEvents: "none",
};

const glowBlob2 = {
  position: "absolute",
  bottom: "-20%",
  right: "-10%",
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
  pointerEvents: "none",
};

const cardStyle = {
  width: "400px",
  maxWidth: "90vw",
  background: "rgba(17, 24, 39, 0.8)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  padding: "36px 32px",
  borderRadius: "16px",
  textAlign: "center",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)",
  position: "relative",
  zIndex: 1,
  animation: "fadeInUp 0.5s ease",
};

const logoStyle = {
  fontSize: "48px",
  marginBottom: "8px",
  filter: "drop-shadow(0 0 12px rgba(6,214,160,0.4))",
};

const titleStyle = {
  color: "var(--text-primary)",
  fontSize: "26px",
  fontWeight: "800",
  margin: "0 0 4px",
  letterSpacing: "-0.02em",
};

const subtitleStyle = {
  color: "var(--text-muted)",
  fontSize: "14px",
  marginBottom: "24px",
};

const fieldGroupStyle = {
  textAlign: "left",
  marginBottom: "16px",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "600",
  color: "var(--text-secondary)",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.08)",
  fontSize: "14px",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.04)",
  color: "var(--text-primary)",
  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #059669 0%, #06d6a0 100%)",
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 16px rgba(6, 214, 160, 0.3)",
  fontSize: "15px",
  letterSpacing: "0.01em",
  marginTop: "4px",
};

const errorStyle = {
  background: "rgba(239,68,68,0.1)",
  border: "1px solid rgba(239,68,68,0.2)",
  borderRadius: "8px",
  padding: "10px 14px",
  color: "#f87171",
  fontSize: "13px",
  marginBottom: "14px",
  textAlign: "left",
};

const dividerStyle = {
  position: "relative",
  margin: "20px 0",
  borderTop: "1px solid rgba(255,255,255,0.06)",
};

const dividerTextStyle = {
  position: "absolute",
  top: "-10px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(17, 24, 39, 0.8)",
  padding: "0 12px",
  color: "var(--text-muted)",
  fontSize: "12px",
};

const switchStyle = {
  color: "var(--text-muted)",
  fontSize: "13px",
  margin: 0,
};

const linkStyle = {
  color: "var(--accent)",
  cursor: "pointer",
  fontWeight: "600",
  transition: "color 0.2s ease",
};

const credentialsStyle = {
  marginTop: "16px",
  padding: "12px 16px",
  background: "rgba(6,214,160,0.06)",
  border: "1px solid rgba(6,214,160,0.12)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "var(--text-secondary)",
  textAlign: "left",
  lineHeight: "1.7",
};

export default Login;
