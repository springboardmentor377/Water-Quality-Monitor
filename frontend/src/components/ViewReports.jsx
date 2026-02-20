import { useEffect, useState } from "react";

const API = "http://localhost:8000";

function ViewReports({ filterType = "pending" }) {
  const [reports, setReports] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchReports = async () => {
    const res = await fetch(`${API}/reports/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${API}/reports/${id}/status?status=${status}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      fetchReports();
    } catch (err) {
      alert(err.message);
    }
  };

  const statusColor = {
    pending: "#f59e0b",
    verified: "#06d6a0",
    rejected: "#ef4444",
  };

  const filteredReports = reports.filter(r => {
    if (filterType === "verified-rejected") {
      return r.status === "verified" || r.status === "rejected";
    } else if (filterType === "pending") {
      if (user?.role === "authority") {
        return r.status === "pending";
      }
      return true;
    }
    return true;
  });

  return (
    <div className="page-container">
      <h2 className="page-header">
        <span>📊</span>{" "}
        {filterType === "pending"
          ? (user?.role === "authority" ? "Pending Reports for Verification" : "My Submitted Reports")
          : "All Verified & Rejected Reports"
        }
      </h2>

      {filteredReports.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No reports found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "14px" }}>
          {filteredReports.map((report, idx) => (
            <div
              key={report.id}
              className="glass-card"
              style={{
                padding: "18px",
                borderLeft: `3px solid ${statusColor[report.status] || "var(--accent)"}`,
                animation: `fadeInUp 0.3s ease ${idx * 0.05}s both`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                <h3 style={{ color: "var(--text-primary)", fontSize: "15px", fontWeight: "700", margin: 0 }}>
                  📍 {report.location}
                </h3>
                <span style={{
                  background: statusColor[report.status],
                  color: "#fff",
                  padding: "3px 10px",
                  borderRadius: "12px",
                  fontSize: "10px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}>
                  {report.status}
                </span>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "8px", lineHeight: "1.6" }}>
                {report.description}
              </p>

              <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: "4px 0" }}>
                💧 <strong>Water Source:</strong> {report.water_source}
              </p>

              {report.created_at && (
                <p style={{ color: "var(--text-muted)", fontSize: "11px", margin: "4px 0" }}>
                  🕐 {new Date(report.created_at).toLocaleString()}
                </p>
              )}

              {user?.role === "authority" && filterType === "pending" && report.status === "pending" && (
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <button
                    onClick={() => updateStatus(report.id, "verified")}
                    className="btn-primary"
                    style={{ fontSize: "12px", padding: "7px 14px" }}
                  >
                    ✓ Verify
                  </button>
                  <button
                    onClick={() => updateStatus(report.id, "rejected")}
                    className="btn-danger"
                    style={{ fontSize: "12px", padding: "7px 14px" }}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewReports;
