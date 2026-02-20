import { useState, useEffect } from "react";

function Navbar({ activePage, onNavigate, onLogout }) {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  const getRoleBadge = (role) => {
    const badges = {
      citizen: "🏠 Citizen",
      user: "👤 User",
      ngo: "🏛️ NGO",
      authority: "👮 Authority",
      admin: "⚙️ Admin",
    };
    return badges[role] || role;
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "map", label: "Map", icon: "🌍" },
    { key: "report", label: "Report", icon: "📋" },
    { key: "all_reports", label: "Reports", icon: "📑" },
    ...(user?.role === "authority" || user?.role === "admin"
      ? [{ key: "view", label: "Verify", icon: "✅" }]
      : []),
    { key: "alerts", label: "Alerts", icon: "🚨" },
    { key: "collaborations", label: "Collabs", icon: "🤝" },
    { key: "analytics", label: "Analytics", icon: "📈" },
    { key: "predictive", label: "Predict", icon: "🔮" },
    ...(user?.role === "ngo"
      ? [{ key: "ngo_projects", label: "Projects", icon: "🏛️" }]
      : []),
  ];

  return (
    <nav style={navStyle}>
      {/* Top bar */}
      <div style={topBarStyle}>
        <span
          style={brandStyle}
          onClick={() => onNavigate("dashboard")}
        >
          <span style={brandIconStyle}>💧</span>
          WaterWatch
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user && (
            <span style={userInfoStyle}>
              {user.name}
              <span style={roleBadgeStyle}>{getRoleBadge(user.role)}</span>
            </span>
          )}
          <button onClick={onLogout} style={logoutBtnStyle}>
            Logout
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={hamburgerStyle}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Nav links */}
      <div style={{
        ...navLinksStyle,
        ...(mobileOpen ? { maxHeight: "400px", opacity: 1 } : {}),
      }}>
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => { onNavigate(item.key); setMobileOpen(false); }}
            style={{
              ...navBtnStyle,
              ...(activePage === item.key ? navBtnActiveStyle : {}),
            }}
          >
            <span style={{ fontSize: "13px" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* --- Styles --- */
const navStyle = {
  position: "sticky",
  top: 0,
  zIndex: 100,
  background: "rgba(11, 17, 32, 0.85)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
};

const topBarStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 20px 8px",
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#f1f5f9",
  fontWeight: "800",
  fontSize: "18px",
  cursor: "pointer",
  letterSpacing: "-0.02em",
  transition: "color 0.2s ease",
};

const brandIconStyle = {
  fontSize: "22px",
  filter: "drop-shadow(0 0 6px rgba(6,214,160,0.4))",
};

const userInfoStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "rgba(241,245,249,0.7)",
  fontSize: "12px",
  fontWeight: "500",
};

const roleBadgeStyle = {
  background: "rgba(6,214,160,0.12)",
  color: "#06d6a0",
  padding: "2px 8px",
  borderRadius: "12px",
  fontSize: "11px",
  fontWeight: "600",
  border: "1px solid rgba(6,214,160,0.15)",
};

const logoutBtnStyle = {
  background: "rgba(239,68,68,0.12)",
  color: "#f87171",
  border: "1px solid rgba(239,68,68,0.2)",
  borderRadius: "6px",
  padding: "5px 14px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "12px",
  transition: "all 0.2s ease",
};

const hamburgerStyle = {
  display: "none",
  background: "transparent",
  color: "#f1f5f9",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "6px",
  padding: "4px 8px",
  fontSize: "16px",
  cursor: "pointer",
};

const navLinksStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "4px",
  padding: "4px 20px 10px",
  alignItems: "center",
};

const navBtnStyle = {
  color: "rgba(241,245,249,0.65)",
  background: "transparent",
  border: "1px solid transparent",
  borderRadius: "6px",
  padding: "5px 12px",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "12px",
  transition: "all 0.25s ease",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  whiteSpace: "nowrap",
  boxShadow: "none",
  transform: "none",
  filter: "none",
};

const navBtnActiveStyle = {
  color: "#06d6a0",
  background: "rgba(6,214,160,0.08)",
  border: "1px solid rgba(6,214,160,0.2)",
  boxShadow: "0 0 12px rgba(6,214,160,0.1)",
  fontWeight: "600",
};

export default Navbar;