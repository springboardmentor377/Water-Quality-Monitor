import { useEffect, useState, useRef } from "react";

const API = "http://localhost:8000";

function Alerts({ onReportAlert }) {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    type: "boil_notice",
    message: "",
    location: "",
    latitude: "",
    longitude: "",
    severity: "medium",
  });
  const [creating, setCreating] = useState(false);
  const [notification, setNotification] = useState(null); // { msg, type: 'success'|'error' }
  const notifTimerRef = useRef(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    notifTimerRef.current = setTimeout(() => setNotification(null), 4000);
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API}/alerts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAlerts(data);
      filterAlerts(data, filterType);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  const filterAlerts = (alertsList, type) => {
    if (type === "all") {
      setFilteredAlerts(alertsList);
    } else {
      setFilteredAlerts(alertsList.filter((a) => a.type === type));
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (type) => {
    setFilterType(type);
    filterAlerts(alerts, type);
  };

  const resolveAlert = async (alertId) => {
    try {
      const res = await fetch(`${API}/alerts/${alertId}/resolve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchAlerts();
      }
    } catch (err) {
      console.error("Failed to resolve alert", err);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch(`${API}/alerts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createForm),
      });

      if (res.ok) {
        setShowCreateForm(false);
        setCreateForm({
          type: "boil_notice",
          message: "",
          location: "",
          latitude: "",
          longitude: "",
          severity: "medium",
        });
        fetchAlerts();
        showNotification("✅ Alert created successfully!", "success");
      } else {
        const data = await res.json().catch(() => ({}));
        showNotification("❌ " + (data.detail || "Failed to create alert"), "error");
      }
    } catch (err) {
      showNotification("❌ Error: " + err.message + " — Is the backend running?", "error");
    } finally {
      setCreating(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: "#06d6a0",
      medium: "#f59e0b",
      high: "#ef4444",
      critical: "#dc2626",
    };
    return colors[severity] || "#06d6a0";
  };

  const getAlertIcon = (type) => {
    const icons = {
      boil_notice: "🔥",
      contamination: "⚠️",
      outage: "❌",
    };
    return icons[type] || "📢";
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    margin: "6px 0 14px 0",
    border: "1px solid var(--border-subtle)",
    borderRadius: "8px",
    fontSize: "13px",
    boxSizing: "border-box",
    background: "var(--bg-glass)",
    color: "var(--text-primary)",
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontWeight: "600",
    color: "var(--text-secondary)",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  const filterBtnStyle = (isActive) => ({
    padding: "8px 16px",
    background: isActive ? "linear-gradient(135deg, var(--accent-dark), var(--accent))" : "var(--bg-glass)",
    color: isActive ? "white" : "var(--text-secondary)",
    border: `1px solid ${isActive ? "var(--accent-dark)" : "var(--border-subtle)"}`,
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    transition: "all 0.25s ease",
    boxShadow: isActive ? "0 4px 12px rgba(6,214,160,0.2)" : "none",
    transform: "none",
    filter: "none",
  });

  return (
    <div className="page-container">
      <h2 className="page-header">
        <span>🚨</span> Water Quality Alerts
      </h2>

      {/* Inline Notification Banner */}
      {notification && (
        <div style={{
          padding: "12px 20px",
          marginBottom: "16px",
          borderRadius: "10px",
          fontWeight: "600",
          fontSize: "14px",
          background: notification.type === "success"
            ? "linear-gradient(135deg, rgba(6,214,160,0.2), rgba(6,214,160,0.1))"
            : "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))",
          border: `1px solid ${notification.type === "success" ? "rgba(6,214,160,0.5)" : "rgba(239,68,68,0.5)"}`,
          color: notification.type === "success" ? "#06d6a0" : "#ef4444",
          animation: "fadeInUp 0.3s ease",
        }}>
          {notification.msg}
        </div>
      )}

      {/* Create Alert Button */}
      {(user?.role === "authority" || user?.role === "admin") && (
        <div style={{ marginBottom: "16px" }}>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
            style={{ fontSize: "13px" }}
          >
            {showCreateForm ? "Cancel" : "➕ Create New Alert"}
          </button>
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (user?.role === "authority" || user?.role === "admin") && (
        <form onSubmit={handleCreateAlert} className="glass-card" style={{ maxWidth: "600px", padding: "24px", marginBottom: "24px", animation: "slideDown 0.3s ease" }}>
          <h3 style={{ color: "var(--text-primary)", marginBottom: "16px", marginTop: "0" }}>
            🚨 Create New Alert
          </h3>

          <label style={labelStyle}>Alert Type *</label>
          <select
            value={createForm.type}
            onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
            style={inputStyle}
            required
          >
            <option value="boil_notice">🔥 Boil Notice</option>
            <option value="contamination">⚠️ Contamination</option>
            <option value="outage">❌ Outage</option>
          </select>

          <label style={labelStyle}>Message *</label>
          <textarea
            value={createForm.message}
            onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
            placeholder="Describe the alert details..."
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            required
          />

          <label style={labelStyle}>Location *</label>
          <input
            value={createForm.location}
            onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
            placeholder="e.g., Yamuna River, Delhi"
            style={inputStyle}
            required
          />

          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Latitude</label>
              <input
                value={createForm.latitude}
                onChange={(e) => setCreateForm({ ...createForm, latitude: e.target.value })}
                placeholder="e.g., 28.6139"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Longitude</label>
              <input
                value={createForm.longitude}
                onChange={(e) => setCreateForm({ ...createForm, longitude: e.target.value })}
                placeholder="e.g., 77.2090"
                style={inputStyle}
              />
            </div>
          </div>

          <label style={labelStyle}>Severity *</label>
          <select
            value={createForm.severity}
            onChange={(e) => setCreateForm({ ...createForm, severity: e.target.value })}
            style={inputStyle}
            required
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🟠 High</option>
            <option value="critical">🔴 Critical</option>
          </select>

          <button
            type="submit"
            disabled={creating}
            className="btn-primary"
            style={{
              width: "100%",
              marginTop: "8px",
              opacity: creating ? 0.6 : 1,
            }}
          >
            {creating ? "Creating..." : "🚨 Create Alert"}
          </button>
        </form>
      )}

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { key: "all", label: "All" },
          { key: "boil_notice", label: "Boil Notices" },
          { key: "contamination", label: "Contamination" },
          { key: "outage", label: "Outages" },
        ].map((f) => (
          <button
            key={f.key}
            style={filterBtnStyle(filterType === f.key)}
            onClick={() => handleFilterChange(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      {filteredAlerts.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ fontSize: "15px", fontWeight: "600", color: "var(--accent)" }}>✓ No active alerts</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            All water quality parameters are within safe limits
          </p>
        </div>
      ) : (
        filteredAlerts.map((al, idx) => (
          <div
            key={al.id}
            className="glass-card"
            style={{
              padding: "18px",
              marginBottom: "12px",
              borderLeft: `3px solid ${getSeverityColor(al.severity)}`,
              animation: `fadeInUp 0.3s ease ${idx * 0.05}s both`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "12px", gap: "12px" }}>
              <span style={{ fontSize: "26px" }}>{getAlertIcon(al.type)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>{al.location}</div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                  <span style={{
                    background: getSeverityColor(al.severity),
                    color: "#fff",
                    padding: "2px 10px",
                    borderRadius: "12px",
                    fontSize: "10px",
                    fontWeight: "700",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}>
                    {al.severity.toUpperCase()}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {new Date(al.issued_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "12px", lineHeight: "1.6" }}>
              {al.message}
            </p>

            {al.latitude && al.longitude && (
              <p style={{ fontSize: "12px", color: "var(--accent)", marginBottom: "12px" }}>
                📍 Lat: {al.latitude}, Lon: {al.longitude}
              </p>
            )}

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(user?.role === "authority" || user?.role === "admin") && al.is_active === "true" && (
                <button
                  onClick={() => resolveAlert(al.id)}
                  className="btn-danger"
                  style={{ fontSize: "12px", padding: "7px 14px" }}
                >
                  Mark as Resolved
                </button>
              )}

              {!al.report_id && onReportAlert && (
                <button
                  onClick={() => onReportAlert(al.id)}
                  style={{
                    padding: "7px 14px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
                    transform: "none",
                    filter: "none",
                  }}
                >
                  📝 Report Issue
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Alerts;
