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
    try {
      const res = await api.get("/reports");
      // Handle both array response and object response (e.g., { reports: [...] } or { data: [...] })
      const reportsData = Array.isArray(res.data)
        ? res.data
        : (res.data.reports || res.data.data || []);
      setReports(reportsData);
    } catch (error) {
      console.error("Failed to load reports:", error);
      setReports([]);
    }
  };

  const updateStatus = async (id, verified) => {
    const formData = new URLSearchParams();
    formData.append("report_id", id);
    formData.append("verified", verified);
    await api.post("/reports/action", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    await loadReports();
  };

  const deleteReport = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) return;

    try {
      await api.delete(`/reports/${id}`);
      setReports(reports.filter(r => r.id !== id));
      if (selectedReport?.id === id) setSelectedReport(null);
    } catch (error) {
      console.error("Failed to delete report:", error);
      alert("Failed to delete report");
    }
  };

  const [selectedReport, setSelectedReport] = useState(null);

  const openReport = (report) => {
    setSelectedReport(report);
  };

  const closeReport = () => {
    setSelectedReport(null);
  };

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-semibold mb-6">Reports</h2>

      {/* Reports Grid/List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <div
            key={r.id}
            className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer relative group"
            onClick={() => openReport(r)}
          >
            <div className="absolute top-2 right-2 flex gap-2">
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold text-white uppercase tracking-wider ${r.status === "pending"
                    ? "bg-yellow-500"
                    : r.status === "verified"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
              >
                {r.status}
              </span>
            </div>

            {r.photo_url && (
              <div className="h-40 w-full mb-3 overflow-hidden rounded-md bg-gray-100">
                <img
                  src={`http://localhost:8000/uploads/${r.photo_url.split(/[\\/]/).pop()}`}
                  alt="Report evidence"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400?text=No+Image" }}
                />
              </div>
            )}

            <h3 className="font-bold text-lg mb-1 truncate">{r.location}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{r.description}</p>
            <div className="text-xs text-gray-500 mb-3">
              <p>Source: {r.water_source}</p>
              <p>Station: {r.station_name}</p>
            </div>

            {/* Action Buttons (Stop Propagation to prevent opening modal) */}
            <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
              {(role === "authority" || role === "admin" || role === "ngo") &&
                r.status === "pending" && (
                  <>
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex-1"
                      onClick={() => updateStatus(r.id, true)}
                    >
                      Verify
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex-1"
                      onClick={() => updateStatus(r.id, false)}
                    >
                      Reject
                    </button>
                  </>
                )}

              {role === "admin" && (
                <button
                  className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900 flex-1"
                  onClick={(e) => deleteReport(e, r.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[2000] backdrop-blur-sm" onClick={closeReport}>
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
              {selectedReport.photo_url ? (
                <img
                  src={`http://localhost:8000/uploads/${selectedReport.photo_url.split(/[\\/]/).pop()}`}
                  alt="Evidence"
                  className="max-h-[60vh] object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="text-gray-400">No Image Available</div>
              )}
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${selectedReport.status === "pending"
                        ? "bg-yellow-500"
                        : selectedReport.status === "verified"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                  >
                    {selectedReport.status}
                  </span>
                  <h2 className="text-2xl font-bold mt-2 text-gray-800">{selectedReport.location}</h2>
                </div>
                <button
                  onClick={closeReport}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase">Description</h4>
                  <p className="text-gray-800 leading-relaxed">{selectedReport.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase">Water Source</h4>
                    <p className="text-gray-800">{selectedReport.water_source}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase">Station</h4>
                    <p className="text-gray-800">{selectedReport.station_name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase">Report ID</h4>
                    <p className="text-gray-800">#{selectedReport.id}</p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                {(role === "authority" || role === "admin" || role === "ngo") &&
                  selectedReport.status === "pending" && (
                    <>
                      <button
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium flex-1 shadow-sm transition-colors"
                        onClick={() => { updateStatus(selectedReport.id, true); closeReport(); }}
                      >
                        Verify Report
                      </button>
                      <button
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-medium flex-1 shadow-sm transition-colors"
                        onClick={() => { updateStatus(selectedReport.id, false); closeReport(); }}
                      >
                        Reject Report
                      </button>
                    </>
                  )}
                {role === "admin" && (
                  <button
                    className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 font-medium flex-1 shadow-sm transition-colors"
                    onClick={(e) => { deleteReport(e, selectedReport.id); closeReport(); }}
                  >
                    Delete Report
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
