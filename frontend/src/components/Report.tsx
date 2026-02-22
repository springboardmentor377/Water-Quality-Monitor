import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Report.css";

export default function Report() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);

  const fetchReports = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No authentication token found");
      setReports([]);
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.get("http://127.0.0.1:8000/reports", config)
      .then((res) => setReports(res.data))
      .catch(err => {
        console.log("Reports fetch error:", err);
        setReports([]);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please login to update report status.");
      return;
    }
    try {
      await axios.put(`http://127.0.0.1:8000/reports/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReports();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update report status.");
    }
  };

  return (
    <div className="ngo-page">

      <div className="ngo-header">
        <h2>Reports</h2>
        <button
          className="create-btn"
          onClick={() => navigate("/dashboard/create-report")}
        >
          Create Report
        </button>
      </div>

      <div className="ngo-card">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Project</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Action</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.description}</td>
                <td>{report.water_source}</td>
                <td>{report.status}</td>
                <td>
                  {report.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(report.id, "verified")}
                        className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                      >
                        Verify
                      </button>

                      <button
                        onClick={() => updateStatus(report.id, "rejected")}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
                <td>{report.created_at ? new Date(report.created_at).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
