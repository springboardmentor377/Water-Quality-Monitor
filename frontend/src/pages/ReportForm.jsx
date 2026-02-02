import { useState } from "react";
import api from "../services/api";

export default function ReportForm() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [waterSource, setWaterSource] = useState("");
  const [file, setFile] = useState(null);

  const submit = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("description", description);
      formData.append("location", location);
      formData.append("water_source", waterSource);
      if (file) formData.append("file", file);

      await api.post("/report", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Report submitted successfully");
    } catch (err) {
      alert(err.response?.data?.detail || "Report failed");
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Submit Report</h2>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Water Source"
          onChange={(e) => setWaterSource(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-3 rounded"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          className="mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={submit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
