import { useEffect, useState, useRef } from "react";

const API = "http://localhost:8000";

function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const pieAlertRef = useRef(null);
    const pieReportRef = useRef(null);
    const boxPlotRef = useRef(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    useEffect(() => {
        if (data) {
            drawAlertPie();
            drawReportPie();
            drawBoxPlot();
        }
    }, [data]);

    const fetchDashboard = async () => {
        try {
            const res = await fetch(`${API}/dashboard-data/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const d = await res.json();
            setData(d);
        } catch (err) {
            console.error("Dashboard fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    const drawPie = (canvas, counts, labels, colors) => {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;
        const pieAreaH = h - 60;
        const cx = w / 2;
        const cy = pieAreaH / 2;
        const r = Math.min(w, pieAreaH) / 2 - 20;
        const total = Object.values(counts).reduce((a, b) => a + b, 0);

        ctx.clearRect(0, 0, w, h);

        if (total === 0) {
            ctx.fillStyle = "#64748b";
            ctx.font = "14px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("No data", cx, cy);
            return;
        }

        let startAngle = -Math.PI / 2;
        const keys = Object.keys(counts);
        keys.forEach((key, i) => {
            const slice = (counts[key] / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, startAngle, startAngle + slice);
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            ctx.strokeStyle = "rgba(11,17,32,0.8)";
            ctx.lineWidth = 3;
            ctx.stroke();

            if (counts[key] > 0) {
                const mid = startAngle + slice / 2;
                const lx = cx + (r * 0.6) * Math.cos(mid);
                const ly = cy + (r * 0.6) * Math.sin(mid);
                ctx.fillStyle = "#fff";
                ctx.font = "bold 16px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(String(counts[key]), lx, ly);
            }
            startAngle += slice;
        });

        const legendY = pieAreaH + 10;
        const legendItemWidth = w / keys.length;
        keys.forEach((key, i) => {
            const lx = legendItemWidth * i + legendItemWidth / 2;
            ctx.beginPath();
            ctx.arc(lx - 40, legendY + 10, 6, 0, Math.PI * 2);
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            ctx.fillStyle = "#94a3b8";
            ctx.font = "600 12px Inter, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(`${labels[i]}: ${counts[key]}`, lx - 28, legendY + 10);
        });
    };

    const drawAlertPie = () => {
        if (!data?.alert_status_counts) return;
        drawPie(
            pieAlertRef.current,
            data.alert_status_counts,
            ["Active", "Resolved"],
            ["#ef4444", "#06d6a0"]
        );
    };

    const drawReportPie = () => {
        if (!data?.report_status_counts) return;
        drawPie(
            pieReportRef.current,
            data.report_status_counts,
            ["Pending", "Verified", "Rejected"],
            ["#f59e0b", "#06d6a0", "#ef4444"]
        );
    };

    const drawBoxPlot = () => {
        const canvas = boxPlotRef.current;
        if (!canvas || !data?.parameter_stats) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const params = Object.keys(data.parameter_stats);
        if (params.length === 0) return;

        const margin = { top: 30, right: 30, bottom: 50, left: 60 };
        const plotW = w - margin.left - margin.right;
        const plotH = h - margin.top - margin.bottom;
        const barWidth = Math.min(40, plotW / params.length - 20);

        let globalMax = 0;
        params.forEach((p) => {
            const s = data.parameter_stats[p];
            if (s.max > globalMax) globalMax = s.max;
        });
        globalMax = globalMax * 1.15;

        const colors = ["#06d6a0", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6"];

        params.forEach((param, i) => {
            const s = data.parameter_stats[param];
            const cx = margin.left + (i + 0.5) * (plotW / params.length);
            const scale = (v) => margin.top + plotH - (v / globalMax) * plotH;

            const yMin = scale(s.min);
            const yQ1 = scale(s.q1);
            const yMed = scale(s.median);
            const yQ3 = scale(s.q3);
            const yMax = scale(s.max);

            ctx.strokeStyle = colors[i % colors.length];
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx, yMin);
            ctx.lineTo(cx, yQ1);
            ctx.moveTo(cx, yQ3);
            ctx.lineTo(cx, yMax);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cx - barWidth / 4, yMin);
            ctx.lineTo(cx + barWidth / 4, yMin);
            ctx.moveTo(cx - barWidth / 4, yMax);
            ctx.lineTo(cx + barWidth / 4, yMax);
            ctx.stroke();

            ctx.fillStyle = colors[i % colors.length] + "22";
            ctx.strokeStyle = colors[i % colors.length];
            ctx.fillRect(cx - barWidth / 2, yQ3, barWidth, yQ1 - yQ3);
            ctx.strokeRect(cx - barWidth / 2, yQ3, barWidth, yQ1 - yQ3);

            ctx.strokeStyle = colors[i % colors.length];
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx - barWidth / 2, yMed);
            ctx.lineTo(cx + barWidth / 2, yMed);
            ctx.stroke();

            ctx.fillStyle = "#94a3b8";
            ctx.font = "12px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(param, cx, h - margin.bottom + 20);
        });

        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, margin.top + plotH);
        ctx.stroke();

        for (let i = 0; i <= 5; i++) {
            const v = (globalMax / 5) * i;
            const y = margin.top + plotH - (v / globalMax) * plotH;
            ctx.fillStyle = "#64748b";
            ctx.font = "11px Inter, sans-serif";
            ctx.textAlign = "right";
            ctx.fillText(v.toFixed(2), margin.left - 8, y + 4);
            ctx.strokeStyle = "rgba(255,255,255,0.04)";
            ctx.beginPath();
            ctx.moveTo(margin.left, y);
            ctx.lineTo(w - margin.right, y);
            ctx.stroke();
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px", animation: "pulse 1.5s infinite" }}>💧</div>
                <h2 style={{ color: "var(--text-secondary)", fontWeight: "600" }}>Loading Dashboard...</h2>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
                <h2 style={{ color: "#ef4444", fontWeight: "600" }}>Failed to load dashboard</h2>
            </div>
        );
    }

    const severityColor = {
        low: "#06d6a0",
        medium: "#f59e0b",
        high: "#ef4444",
        critical: "#dc2626",
    };

    const statusColor = {
        pending: "#f59e0b",
        verified: "#06d6a0",
        rejected: "#ef4444",
    };

    return (
        <div className="page-container">
            <h2 className="page-header">
                <span>📊</span> Dashboard
            </h2>

            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                {[
                    { label: "Water Stations", value: data.total_stations, color: "#06d6a0" },
                    { label: "Total Readings", value: data.total_readings, color: "#6366f1" },
                    { label: "Avg Readings/Station", value: data.avg_readings_per_station, color: "#f59e0b" },
                    { label: "Avg Reports/Station", value: data.avg_reports_per_station, color: "#ec4899" },
                ].map((stat, i) => (
                    <div key={i} className="stat-card" style={{ animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {stat.label}
                        </div>
                        <div style={{ fontSize: "36px", fontWeight: "800", color: stat.color, margin: "8px 0 2px", letterSpacing: "-0.02em" }}>
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pie Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                <div className="glass-card" style={{ padding: "20px" }}>
                    <h3 style={{ color: "var(--text-primary)", marginBottom: "12px", marginTop: 0, fontWeight: "700" }}>
                        🚨 Alert Status
                    </h3>
                    <canvas ref={pieAlertRef} width={340} height={280} style={{ width: "100%", maxWidth: "340px", margin: "0 auto", display: "block" }} />
                </div>
                <div className="glass-card" style={{ padding: "20px" }}>
                    <h3 style={{ color: "var(--text-primary)", marginBottom: "12px", marginTop: 0, fontWeight: "700" }}>
                        📋 Report Status
                    </h3>
                    <canvas ref={pieReportRef} width={400} height={280} style={{ width: "100%", maxWidth: "400px", margin: "0 auto", display: "block" }} />
                </div>
            </div>

            {/* Box Plot */}
            <div className="glass-card" style={{ padding: "20px", marginBottom: "24px" }}>
                <h3 style={{ color: "var(--text-primary)", marginBottom: "12px", marginTop: 0, fontWeight: "700" }}>
                    📈 Parameter Statistics
                </h3>
                <canvas ref={boxPlotRef} width={700} height={320} style={{ width: "100%", maxWidth: "700px", margin: "0 auto", display: "block" }} />
            </div>

            {/* Latest Alerts & Reports */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "16px" }}>
                <div className="glass-card" style={{ padding: "20px" }}>
                    <h3 style={{ color: "var(--text-primary)", marginBottom: "16px", marginTop: 0, fontWeight: "700" }}>
                        🚨 Latest Alerts
                    </h3>
                    {data.latest_alerts.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No alerts yet</p>
                    ) : (
                        data.latest_alerts.map((a) => (
                            <div
                                key={a.id}
                                style={{
                                    padding: "14px",
                                    marginBottom: "10px",
                                    borderRadius: "8px",
                                    border: "1px solid var(--border-subtle)",
                                    borderLeft: `3px solid ${severityColor[a.severity] || "#06d6a0"}`,
                                    background: "var(--bg-glass)",
                                    transition: "border-color 0.2s ease",
                                }}
                            >
                                <div style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "14px" }}>{a.location}</div>
                                <div style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "6px 0" }}>{a.message}</div>
                                <div style={{ display: "flex", gap: "8px", fontSize: "11px", alignItems: "center" }}>
                                    <span style={{
                                        background: severityColor[a.severity],
                                        color: "#fff",
                                        padding: "2px 8px",
                                        borderRadius: "12px",
                                        fontWeight: "700",
                                        fontSize: "10px",
                                        letterSpacing: "0.04em",
                                    }}>
                                        {a.severity?.toUpperCase()}
                                    </span>
                                    <span style={{ color: "var(--text-muted)" }}>{a.issued_at ? new Date(a.issued_at).toLocaleString() : ""}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="glass-card" style={{ padding: "20px" }}>
                    <h3 style={{ color: "var(--text-primary)", marginBottom: "16px", marginTop: 0, fontWeight: "700" }}>
                        📋 Latest Reports
                    </h3>
                    {data.latest_reports.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No reports yet</p>
                    ) : (
                        data.latest_reports.map((r) => (
                            <div
                                key={r.id}
                                style={{
                                    padding: "14px",
                                    marginBottom: "10px",
                                    borderRadius: "8px",
                                    border: "1px solid var(--border-subtle)",
                                    borderLeft: `3px solid ${statusColor[r.status] || "#06d6a0"}`,
                                    background: "var(--bg-glass)",
                                }}
                            >
                                <div style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "14px" }}>{r.location}</div>
                                <div style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "6px 0" }}>{r.description?.slice(0, 100)}</div>
                                <div style={{ display: "flex", gap: "8px", fontSize: "11px", alignItems: "center", flexWrap: "wrap" }}>
                                    <span style={{
                                        background: statusColor[r.status],
                                        color: "#fff",
                                        padding: "2px 8px",
                                        borderRadius: "12px",
                                        fontWeight: "700",
                                        fontSize: "10px",
                                    }}>
                                        {r.status?.toUpperCase()}
                                    </span>
                                    <span style={{ color: "var(--text-muted)" }}>{r.station_name || ""}</span>
                                    <span style={{ color: "var(--text-muted)" }}>{r.created_at ? new Date(r.created_at).toLocaleString() : ""}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
