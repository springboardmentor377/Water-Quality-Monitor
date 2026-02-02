import { useEffect, useState } from "react";
import api from "../services/api";
import StationMap from "../components/StationMap";

export default function Dashboard() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    api.get("/stations").then((res) => setStations(res.data));
  }, []);

  return (
    /* PAGE CENTERING */
    <div className="flex justify-center w-full min-h-screen bg-gray-100">
      <div className="w-full max-w-7xl px-6 py-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Water Quality Dashboard
        </h1>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm text-gray-500">Total Stations</h3>
            <p className="text-2xl font-bold">{stations.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm text-gray-500">Reports Submitted</h3>
            <p className="text-2xl font-bold">—</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm text-gray-500">Alerts</h3>
            <p className="text-2xl font-bold text-red-500">—</p>
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Monitoring Stations Map
          </h2>

          <div className="h-[500px] rounded overflow-hidden">
            <StationMap stations={stations} />
          </div>
        </div>

      </div>
    </div>
  );
}
