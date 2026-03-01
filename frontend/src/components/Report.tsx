import { useEffect, useState } from "react";
import axios from "axios";

export default function Report() {
  const [reports, setReports] = useState<any[]>([]);

  const fetchReports = () => {
    axios
      .get("http://127.0.0.1:8000/reports/")
      .then((res) => setReports(res.data));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await axios.put(`http://127.0.0.1:8000/reports/${id}`, {
      status,
    });
    fetchReports();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4 font-bold">All Reports</h2>

      {reports.map((report) => (
        <div key={report.id} className="border p-4 mb-3 rounded shadow">
          <p><b>Location:</b> {report.location}</p>
          <p><b>Description:</b> {report.description}</p>
          <p><b>Status:</b> {report.status}</p>

          {report.status === "pending" && (
            <div className="mt-2 space-x-2">
              <button
                onClick={() => updateStatus(report.id, "verified")}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Verify
              </button>
              <button
                onClick={() => updateStatus(report.id, "rejected")}
                className="bg-red-500 text-white px-3 py-1 rounded"
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
