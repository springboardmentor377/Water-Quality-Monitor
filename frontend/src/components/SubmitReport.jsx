import { useState, useEffect } from "react";

const API = "http://localhost:8000";

function SubmitReport({ alertId, onDone }) {
  const [stations, setStations] = useState([]);
  const [form, setForm] = useState({
    location: "",
    latitude: "",
    longitude: "",
    description: "",
    water_source: "",
    station_name: "",
    alert_id: alertId || null,
    photo_url: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API}/stations/`)
      .then((r) => r.json())
      .then(setStations)
      .catch(() => { });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, photo_url: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);
      setSuccess(false);

      const payload = { ...form };
      if (!payload.alert_id) delete payload.alert_id;

      const response = await fetch(`${API}/reports/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to submit report");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setForm({
        location: "",
        latitude: "",
        longitude: "",
        description: "",
        water_source: "",
        station_name: "",
        alert_id: null,
        photo_url: "",
        status: "pending",
      });

      if (onDone) onDone();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    margin: "6px 0 14px 0",
    border: "1px solid var(--border-subtle)",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "inherit",
    boxSizing: "border-box",
    background: "var(--bg-glass)",
    color: "var(--text-primary)",
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    marginTop: "4px",
    marginBottom: "4px",
    fontWeight: "600",
    color: "var(--text-secondary)",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", padding: "30px 20px" }}>
      <div className="glass-card" style={{ padding: "28px", animation: "fadeInUp 0.4s ease" }}>
        <h2 className="page-header" style={{ marginBottom: "24px" }}>
          <span>📋</span> {alertId ? "Report Issue for Alert" : "Submit Pollution Report"}
        </h2>

        {alertId && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.15)",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
            fontSize: "13px",
            color: "#f87171",
          }}>
            🔗 This report is linked to Alert #{alertId}
          </div>
        )}

        {success && (
          <div style={{
            padding: "12px 16px",
            background: "rgba(6,214,160,0.1)",
            border: "1px solid rgba(6,214,160,0.2)",
            borderRadius: "8px",
            color: "var(--accent)",
            fontWeight: "600",
            marginBottom: "16px",
            fontSize: "14px",
            animation: "slideDown 0.3s ease",
          }}>
            ✓ Report submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Station Name</label>
          <select name="station_name" value={form.station_name} onChange={handleChange} style={inputStyle}>
            <option value="">-- Select Station (Optional) --</option>
            {stations.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} ({s.location})
              </option>
            ))}
          </select>

          <label style={labelStyle}>Location Name *</label>
          <input name="location" placeholder="e.g., Yamuna River, Delhi" value={form.location} onChange={handleChange} style={inputStyle} required />

          <div style={{
            background: "var(--bg-glass)",
            padding: "16px",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
            marginBottom: "8px",
          }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              📍 Coordinates (Optional)
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Latitude</label>
                <input name="latitude" placeholder="e.g., 28.6139" value={form.latitude} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Longitude</label>
                <input name="longitude" placeholder="e.g., 77.2090" value={form.longitude} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </div>

          <label style={labelStyle}>Water Source *</label>
          <input name="water_source" placeholder="e.g., River, Lake, Ocean, Groundwater" value={form.water_source} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>Description *</label>
          <textarea name="description" placeholder="Describe the pollution details, observations, and impact..." value={form.description} onChange={handleChange} style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }} required />

          <label style={labelStyle}>Upload Photo</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ ...inputStyle, padding: "10px" }} />
          {form.photo_url && (
            <img src={form.photo_url} alt="Preview" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginTop: "8px", marginBottom: "8px" }} />
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "12px",
              fontSize: "15px",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "🔄 Submitting..." : "✓ Submit Report"}
          </button>
        </form>

        <div style={{ marginTop: "16px", fontSize: "11px", color: "var(--text-muted)", textAlign: "center" }}>
          Fields marked with * are required
        </div>
      </div>
    </div>
  );
}

export default SubmitReport;
