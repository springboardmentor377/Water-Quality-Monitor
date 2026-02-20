import { useEffect, useState } from "react";

const API = "http://localhost:8000";

function NgoProjects() {
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        project_name: "",
        contact_email: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API}/ngo-projects/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (err) {
            console.error("Failed to fetch NGO projects", err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API}/ngo-projects/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setShowForm(false);
                setForm({ project_name: "", contact_email: "", description: "" });
                fetchProjects();
                alert("Project published successfully!");
            } else {
                const d = await res.json();
                alert(d.detail || "Failed to publish project");
            }
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
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
                <span>🏛️</span> NGO Projects
            </h2>

            {user?.role === "ngo" && (
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                    style={{ marginBottom: "16px", fontSize: "13px" }}
                >
                    {showForm ? "Cancel" : "➕ Publish New Project"}
                </button>
            )}

            {showForm && user?.role === "ngo" && (
                <form
                    onSubmit={handleSubmit}
                    className="glass-card"
                    style={{ maxWidth: "500px", padding: "24px", marginBottom: "24px", animation: "slideDown 0.3s ease" }}
                >
                    <h3 style={{ color: "var(--text-primary)", marginTop: 0, marginBottom: "16px" }}>Publish Project</h3>

                    <label style={labelStyle}>Project Name *</label>
                    <input
                        value={form.project_name}
                        onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                        placeholder="e.g., Clean River Initiative"
                        style={inputStyle}
                        required
                    />

                    <label style={labelStyle}>Contact Email *</label>
                    <input
                        type="email"
                        value={form.contact_email}
                        onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                        placeholder="e.g., contact@ngo.org"
                        style={inputStyle}
                        required
                    />

                    <label style={labelStyle}>Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Describe your project..."
                        style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: "100%", marginTop: "4px", opacity: loading ? 0.6 : 1 }}
                    >
                        {loading ? "Publishing..." : "📢 Publish Project"}
                    </button>
                </form>
            )}

            {projects.length === 0 ? (
                <div className="glass-card" style={{ textAlign: "center", padding: "40px" }}>
                    <p style={{ color: "var(--text-muted)", fontWeight: "600" }}>No projects published yet</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
                    {projects.map((p, idx) => (
                        <div
                            key={p.id}
                            className="glass-card"
                            style={{
                                padding: "20px",
                                borderLeft: "3px solid var(--accent)",
                                animation: `fadeInUp 0.3s ease ${idx * 0.06}s both`,
                            }}
                        >
                            <h3 style={{ color: "var(--text-primary)", margin: "0 0 6px", fontSize: "17px", fontWeight: "700" }}>
                                {p.project_name}
                            </h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: "4px 0 12px", lineHeight: "1.6" }}>
                                {p.description || "No description"}
                            </p>
                            <p style={{ color: "var(--accent)", fontSize: "12px", margin: "4px 0" }}>
                                📧 {p.contact_email}
                            </p>
                            <p style={{ color: "var(--text-muted)", fontSize: "11px", margin: "4px 0" }}>
                                Published: {new Date(p.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NgoProjects;
