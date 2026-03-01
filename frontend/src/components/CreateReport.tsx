import { useState } from "react";
import axios from "axios";

export default function CreateReport() {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [waterSource, setWaterSource] = useState("");

  const submitReport = async () => {
    await axios.post("http://127.0.0.1:8000/reports/", {
      user_id: 1,
      location,
      description,
      water_source: waterSource,
      photo_url: "",
    });

    alert("Report submitted successfully!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4 font-bold">Submit Report</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Location"
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Water Source"
        onChange={(e) => setWaterSource(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-3"
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={submitReport}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}
