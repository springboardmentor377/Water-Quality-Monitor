import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate(); // ✅ INSIDE component

  return (
    <div className="flex justify-between items-center bg-blue-900 text-white px-6 py-3">
      <h1 className="font-semibold text-lg">Water Quality Monitor</h1>

      <div className="space-x-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 px-3 py-1 rounded"
        >
          Map
        </button>

        <button
          onClick={() => navigate("/reports")}
          className="bg-blue-600 px-3 py-1 rounded"
        >
          View Report
        </button>

        <button
          onClick={() => navigate("/report")}
          className="bg-green-600 px-3 py-1 rounded"
        >
          Create Report
        </button>
      </div>
    </div>
  );
}
