import { useEffect, useState } from "react";

const API = "http://localhost:8000";

function Collaborations() {
  const [collaborations, setCollaborations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    ngo_name: "",
    project_name: "",
    contact_email: "",
    phone: "",
    location: "",
    description: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCollaborations = async () => {
    try {
      const res = await fetch(`${API}/collaborations/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCollaborations(data);
    } catch (err) {
      console.error("Failed to fetch collaborations", err);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API}/collaborations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        fetchCollaborations();
        setShowForm(false);
        setForm({
          ngo_name: "",
          project_name: "",
          contact_email: "",
          phone: "",
          location: "",
          description: "",
          website: "",
        });
        alert("Collaboration added successfully!");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCollaboration = async (id) => {
    if (window.confirm("Are you sure you want to delete this collaboration?")) {
      try {
        const res = await fetch(`${API}/collaborations/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          fetchCollaborations();
        }
      } catch (err) {
        alert(err.message);
      }
    }
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
    outline: "none",
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
  };

  const labelStyle = {
    display: "block",
    fontWeight: "600",
    color: "var(--text-secondary)",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  return (
    <div className="page-container">
      <h2 className="page-header">
        <span>🤝</span> NGO Collaborations
      </h2>

      {user?.role === "authority" && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          style={{ marginBottom: "16px", fontSize: "13px" }}
        >
          {showForm ? "Cancel" : "➕ Add Collaboration"}
        </button>
      )}

      {showForm && user?.role === "authority" && (
        <form onSubmit={handleSubmit} className="glass-card" style={{ maxWidth: "600px", padding: "24px", marginBottom: "24px", animation: "slideDown 0.3s ease" }}>
          <h3 style={{ color: "var(--text-primary)", marginBottom: "16px", marginTop: 0 }}>New Collaboration</h3>

          <label style={labelStyle}>NGO Name *</label>
          <input name="ngo_name" placeholder="NGO Name" value={form.ngo_name} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>Project Name *</label>
          <input name="project_name" placeholder="Project Name" value={form.project_name} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>Contact Email *</label>
          <input name="contact_email" type="email" placeholder="Contact Email" value={form.contact_email} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>Phone</label>
          <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} style={inputStyle} />

          <label style={labelStyle}>Location *</label>
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} style={inputStyle} required />

          <label style={labelStyle}>Description</label>
          <textarea name="description" placeholder="Project Description" value={form.description} onChange={handleChange} style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} />

          <label style={labelStyle}>Website</label>
          <input name="website" placeholder="Website (Optional)" value={form.website} onChange={handleChange} style={inputStyle} />

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "4px" }} disabled={loading}>
            {loading ? "Creating..." : "Create Collaboration"}
          </button>
        </form>
      )}

      {collaborations.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-secondary)" }}>No collaborations yet</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {collaborations.map((collab, idx) => (
            <div key={collab.id} className="glass-card" style={{ padding: "20px", animation: `fadeInUp 0.3s ease ${idx * 0.05}s both` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ color: "var(--text-primary)", marginBottom: "4px", fontSize: "17px", fontWeight: "700" }}>
                    🏛️ {collab.ngo_name}
                  </h3>
                  <p style={{ color: "var(--accent)", fontSize: "13px", fontWeight: "600", margin: "0" }}>
                    {collab.project_name}
                  </p>
                </div>
                {user?.role === "authority" && (
                  <button
                    onClick={() => deleteCollaboration(collab.id)}
                    className="btn-danger"
                    style={{ fontSize: "11px", padding: "6px 12px" }}
                  >
                    Delete
                  </button>
                )}
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "12px", lineHeight: "1.6" }}>
                {collab.description}
              </p>

              <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "2" }}>
                <p>📍 <strong style={{ color: "var(--text-secondary)" }}>Location:</strong> {collab.location}</p>
                <p>📧 <strong style={{ color: "var(--text-secondary)" }}>Email:</strong> {collab.contact_email}</p>
                {collab.phone && <p>📞 <strong style={{ color: "var(--text-secondary)" }}>Phone:</strong> {collab.phone}</p>}
                {collab.website && (
                  <p>
                    🌐{" "}
                    <a href={collab.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: "600" }}>
                      Visit Website →
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collaborations;
