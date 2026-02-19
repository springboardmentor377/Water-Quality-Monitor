import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ReportForm() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [waterSource, setWaterSource] = useState("");
  const [stationName, setStationName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stations, setStations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await api.get("/stations/");
        setStations(response.data);
      } catch (err) {
        console.error("Failed to fetch stations", err);
      }
    };
    fetchStations();
  }, []);

  const handleStationChange = (e) => {
    const selectedName = e.target.value;
    setStationName(selectedName);

    if (selectedName) {
      const station = stations.find(s => s.name === selectedName);
      if (station) {
        // Auto-fill location
        // Note: The new station model from API might strictly have 'name', 'lat', 'lng'.
        // We use the name as location or just keep it simple.
        setLocation(station.name);

        // Auto-detect water source
        const nameLower = station.name.toLowerCase();
        if (nameLower.includes("river") || nameLower.includes("ganga") ||
          nameLower.includes("ghagra") || nameLower.includes("kosi") ||
          nameLower.includes("son") || nameLower.includes("punpun") ||
          nameLower.includes("hindon") || nameLower.includes("kali")) {
          setWaterSource("River");
        } else if (nameLower.includes("canal")) {
          setWaterSource("Canal");
        } else if (nameLower.includes("lake") || nameLower.includes("pool")) {
          setWaterSource("Lake");
        } else {
          setWaterSource("Other");
        }
      }
    } else {
      setLocation("");
      setWaterSource("");
    }
  };

  const validateForm = () => {
    if (!description || description.trim().length < 10) {
      setError("Description must be at least 10 characters");
      return false;
    }

    if (!location || location.trim().length < 3) {
      setError("Please enter a valid location");
      return false;
    }

    if (!waterSource || waterSource.trim().length < 2) {
      setError("Please enter water source type");
      return false;
    }

    if (!stationName || stationName.trim().length < 2) {
      setError("Please enter nearest station name");
      return false;
    }

    if (!file) {
      setError("Please upload a photo");
      return false;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, GIF, and WEBP images are allowed");
      return false;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // Check file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Only JPG, PNG, GIF, and WEBP images are allowed");
        setFile(null);
        e.target.value = "";
        return;
      }

      // Check file size
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        setError("File size must be less than 5MB");
        setFile(null);
        e.target.value = "";
        return;
      }

      setError("");
      setFile(selectedFile);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("description", description.trim());
      formData.append("location", location.trim());
      formData.append("water_source", waterSource.trim());
      formData.append("station_name", stationName.trim());
      formData.append("file", file);

      const response = await api.post("/reports/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Report submitted successfully!");

      // Reset form
      setDescription("");
      setLocation("");
      setWaterSource("");
      setStationName("");
      setFile(null);

      // Reset file input
      const fileInput = document.getElementById("photo-upload");
      if (fileInput) fileInput.value = "";

      // Redirect to reports page
      navigate("/reports");
    } catch (err) {
      console.error("Report submission error:", err);

      let errorMsg = "Failed to submit report";

      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === "string") {
          errorMsg = detail;
        } else if (Array.isArray(detail)) {
          errorMsg = detail.map(e => e.msg || e.detail).join(", ");
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Submit Pollution Report
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nearest Monitoring Station *
            </label>
            <select
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={stationName}
              onChange={handleStationChange}
              disabled={loading}
              required
            >
              <option value="">Select a station...</option>
              {stations.map((station) => (
                <option key={station.id} value={station.name}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location * (Auto-filled)
            </label>
            <input
              className="border border-gray-300 p-3 w-full rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select a station to auto-fill location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Water Source Type * (Auto-detected)
            </label>
            <select
              className="border border-gray-300 p-3 w-full rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={waterSource}
              onChange={(e) => setWaterSource(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Select water source...</option>
              <option value="River">River</option>
              <option value="Lake">Lake</option>
              <option value="Pond">Pond</option>
              <option value="Well">Well</option>
              <option value="Stream">Stream</option>
              <option value="Canal">Canal</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the pollution in detail (minimum 10 characters)"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              required
              minLength={10}
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 mt-1">
              {description.length}/1000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Photo * (Max 5MB, JPG/PNG/GIF/WEBP)
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileChange}
              disabled={loading}
              required
            />
            {file && (
              <p className="text-sm text-green-600 mt-1">
                ✓ {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg w-full transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Report"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}