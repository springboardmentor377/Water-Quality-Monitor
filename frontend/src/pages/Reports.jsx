import { useEffect, useState } from "react";
import api from "../services/api";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    loadReports();

    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    }
  }, []);

  const loadReports = async () => {
    const res = await api.get("/reports");
    setReports(res.data);
  };

  const updateStatus = async (id, verified) => {
    await api.post("/report/action", {
      report_id: id,
      verified: verified,
    });
    await loadReports();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Reports</h2>

      {reports.map(r => (
        <div
          key={r.id}
          className="border rounded-lg p-4 mb-4 shadow-sm bg-white"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">{r.location}</h3>

            <span
              className={`px-3 py-1 rounded text-sm text-white ${
                r.status === "pending"
                  ? "bg-yellow-500"
                  : r.status === "verified"
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
            >
              {r.status.toUpperCase()}
            </span>
          </div>

          <p className="text-gray-700 mb-3">{r.description}</p>

          {(role === "authority" || role === "admin") &&
            r.status === "pending" && (
              <div className="flex gap-3">
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  onClick={() => updateStatus(r.id, true)}
                >
                  Verify
                </button>

                <button
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  onClick={() => updateStatus(r.id, false)}
                >
                  Reject
                </button>
              </div>
            )}
        </div>
      ))}
    </div>
  );
}
