import { useState } from "react";
import api from "../services/api";

function Report() {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const submitReport = async () => {
    await api.post("/reports", {
      user_email: "user@test.com",
      location,
      description,
    });
    alert("Report submitted");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Report Pollution</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Location"
        onChange={e => setLocation(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mb-3"
        placeholder="Description"
        onChange={e => setDescription(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={submitReport}
      >
        Submit
      </button>
    </div>
  );
}

export default Report;
