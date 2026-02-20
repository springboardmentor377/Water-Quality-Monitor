import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateReport.css";

interface Station {
  id: number;
  name: string;
}

export default function CreateReport() {
  const navigate = useNavigate();

  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
  const [project, setProject] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    // Real Government Water Stations Data for dropdown
    const realGovStations = [
      { id: 1, name: "CPCB Delhi - Yamuna" },
      { id: 2, name: "CPCB Varanasi - Ganga" },
      { id: 3, name: "CPCB Haridwar - Ganga" },
      { id: 4, name: "CPCB Patna - Ganga" },
      { id: 5, name: "CPCB Kolkata - Hooghly" },
      { id: 6, name: "CPCB Nashik - Godavari" },
      { id: 7, name: "CPCB Rajahmundry - Godavari" },
      { id: 8, name: "CPCB Vijayawada - Krishna" },
      { id: 9, name: "CPCB Sangli - Krishna" },
      { id: 10, name: "CPCB Mysore - Cauvery" },
      { id: 11, name: "CPCB Bangalore - Cauvery" },
      { id: 12, name: "CPCB Guwahati - Brahmaputra" },
      { id: 13, name: "CPCB Cuttack - Mahanadi" },
      { id: 14, name: "CPCB Jabalpur - Narmada" },
      { id: 15, name: "CPCB Surat - Tapi" },
      { id: 16, name: "CPCB Rishikesh - Ganga" },
      { id: 17, name: "CPCB Agra - Yamuna" },
      { id: 18, name: "CPCB Kanpur - Ganga" },
      { id: 19, name: "CPCB Aurangabad - Godavari" },
      { id: 20, name: "CPCB Satara - Krishna" },
      { id: 21, name: "CPCB Tiruchirappalli - Cauvery" },
      { id: 22, name: "CPCB Dibrugarh - Brahmaputra" },
      { id: 23, name: "CPCB Sambalpur - Mahanadi" },
      { id: 24, name: "CPCB Hoshangabad - Narmada" },
      { id: 25, name: "CPCB Bhusawal - Tapi" },
      { id: 26, name: "CPCB Srinagar - Jhelum" },
      { id: 27, name: "CPCB Allahabad - Ganga" },
      { id: 28, name: "CPCB Prayagraj - Yamuna" },
      { id: 29, name: "CPCB Nanded - Godavari" },
      { id: 30, name: "CPCB Kumbakonam - Cauvery" },
      { id: 31, name: "CPCB Tezpur - Brahmaputra" },
      { id: 32, name: "CPCB Bhubaneswar - Mahanadi" },
      { id: 33, name: "CPCB Bharuch - Narmada" },
      { id: 34, name: "CPCB Malegaon - Tapi" },
      { id: 35, name: "CPCB Jammu - Tawi" },
      { id: 36, name: "CPCB Farakka - Ganga" },
      { id: 37, name: "CPCB Delhi-Noida Border - Yamuna" },
      { id: 38, name: "CPCB Nashik-Triambak - Godavari" },
      { id: 39, name: "CPCB Lucknow - Gomti" },
      { id: 40, name: "CPCB Hyderabad - Musi" }
    ];

    setStations(realGovStations);

    // Still try to fetch from API in case backend has updated data
    axios
      .get("http://127.0.0.1:8000/waterstations", config)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setStations(res.data);
        }
      })
      .catch(err => {
        console.log("Stations fetch error:", err);
        // Keep using the real government stations data
      });
  }, []);

  const submitReport = async () => {
    if (!selectedStationId) {
      alert("Please select a station");
      return;
    }

    if (!project.trim()) {
      alert("Please enter a project name");
      return;
    }

    if (!email.trim()) {
      alert("Please enter a contact email");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const stationName = stations.find(s => s.id === selectedStationId)?.name || "Water Station";

      const response = await axios.post("http://127.0.0.1:8000/api/ngo-project", {
        ngo_name: stationName,
        project_name: project.trim(),
        contact_email: email.trim(),
        location: stationName,
        description: `Collaboration project for ${stationName}`,
        status: "planned"
      }, config);

      console.log("Collaboration created successfully:", response.data);
      alert("Collaboration created successfully!");
      
      // Reset form
      setProject("");
      setEmail("");
      setSelectedStationId(null);
      
      navigate("/dashboard/ngo-collaboration");
    } catch (err: any) {
      console.error("Report submission error:", err);
      if (err.response) {
        console.error("Error response:", err.response.data);
        alert(`Error submitting report: ${err.response.data.detail || 'Unknown error'}`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        alert("Error: No response from server. Please check if the backend is running.");
      } else {
        console.error("Request error:", err.message);
        alert(`Error submitting report: ${err.message}`);
      }
    }
  };

  return (
    <div className="report-wrapper">
      <div className="report-header">
        <h2>NGO Collaboration</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>

      <div className="report-card">
        <h3>Create Collaboration</h3>

        <div className="form-grid">

          <div className="form-group">
            <label>Select Water Station *</label>
            <select
              className="station-dropdown"
              value={selectedStationId || ""}
              onChange={(e) => setSelectedStationId(Number(e.target.value))}
              required
            >
              <option value="">-- Choose a Water Station --</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
            {selectedStationId && (
              <small className="selected-station-info">
                ✓ Station {stations.find(s => s.id === selectedStationId)?.name} selected
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Project name</label>
            <input
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="light-input"
            />
          </div>

          <div className="form-group full-width">
            <label>Contact email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="light-input"
            />
          </div>

        </div>

        <div className="save-container">
          <button className="save-btn" onClick={submitReport}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
