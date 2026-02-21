import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Reports() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [waterSource, setWaterSource] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [reports, setReports] = useState([]);

  const loadReports = async () => {
    try {
      const res = await API.get("/reports");
      setReports(res.data || []);
    } catch {
      alert("Failed to load reports");
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const submitReport = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reports", null, {
        params: {
          location,
          water_source: waterSource,
          description,
          photo_url: photoUrl,
        },
      });

      alert("Report submitted ✅");
      setLocation("");
      setWaterSource("");
      setDescription("");
      setPhotoUrl("");
      loadReports();
    } catch (err) {
      const msg = err?.response?.data?.detail || "Report submit failed";
      alert(msg);
    }
  };

  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) => r.status === "pending").length;
    const verified = reports.filter((r) => r.status === "verified").length;
    const rejected = reports.filter((r) => r.status === "rejected").length;
    return { total, pending, verified, rejected };
  }, [reports]);

  const badgeClass = (status) => {
    if (status === "verified") return "badge badgeVerified";
    if (status === "rejected") return "badge badgeRejected";
    return "badge badgePending";
  };

  const badgeText = (status) => {
    if (status === "verified") return "Verified";
    if (status === "rejected") return "Rejected";
    return "Pending";
  };

  return (
    <div className="dashboardWrap">
      {/* Top Bar */}
      <div className="dashboardTop">
        <div>
          <h2 className="dashTitle">Reports</h2>
          <p className="dashSub">Submit and track water quality issues</p>
        </div>

        <div className="dashBtnRow">
          <button className="btnSecondary" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summaryGrid">
        <div className="summaryCard">
          <p className="summaryNum">{stats.total}</p>
          <p className="summaryLabel">Total</p>
        </div>

        <div className="summaryCard">
          <p className="summaryNum">{stats.pending}</p>
          <p className="summaryLabel">Pending</p>
        </div>

        <div className="summaryCard">
          <p className="summaryNum">{stats.verified}</p>
          <p className="summaryLabel">Verified</p>
        </div>

        <div className="summaryCard">
          <p className="summaryNum">{stats.rejected}</p>
          <p className="summaryLabel">Rejected</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashGrid">
        {/* Form */}
        <div className="dashCard">
          <h3 style={{ marginTop: 0 }}>📝 Submit Report</h3>

          <form onSubmit={submitReport}>
            <div className="field">
              <label className="label">Location</label>
              <input
                className="input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Model Town, Yamuna Nagar"
                required
              />
            </div>

            <div className="field">
              <label className="label">Water Source</label>
              <input
                className="input"
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                placeholder="Tap / River / Handpump"
                required
              />
            </div>

            <div className="field">
              <label className="label">Photo URL</label>
              <input
                className="input"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Optional image link"
              />
            </div>

            <div className="field">
              <label className="label">Description</label>
              <textarea
                className="input"
                style={{ minHeight: 80 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the water issue..."
                required
              />
            </div>

            <button className="btn" type="submit">
              Submit Report
            </button>
          </form>
        </div>

        {/* List */}
        <div className="dashCard">
          <h3 style={{ marginTop: 0 }}>📊 My Reports</h3>

          {reports.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              No reports submitted yet.
            </p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {reports.map((r) => (
                <div
                  key={r.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <strong>
                      {r.location} • {r.water_source}
                    </strong>

                    <span className={badgeClass(r.status)}>
                      {badgeText(r.status)}
                    </span>
                  </div>

                  <div style={{ marginTop: 8 }}>{r.description}</div>

                  {r.photo_url && (
                    <div style={{ marginTop: 6 }}>
                      <a href={r.photo_url} target="_blank" rel="noreferrer">
                        View Photo
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
