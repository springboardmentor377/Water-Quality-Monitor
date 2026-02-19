import React, { useEffect, useState } from "react";
import Stationmap, { stationData } from "../components/Stationmap";
import WaterQualityChart from "../components/WaterQualityChart";
import WaterQualityRadar from "../components/WaterQualityRadar";
import api from "../services/api";

export default function MapFullPage() {
  const [chartData, setChartData] = useState([]);
  const [selectedStation, setSelectedStation] = useState("Select station");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/water-data/live");
        setChartData(res.data);
      } catch (error) {
        console.error("Error fetching water data:", error);
      }
    };
    fetchData();
  }, []);

  // Extract and sort unique stations from data returned by API
  const apiStations = [...new Set(chartData.map(item => item.station))].sort();
  const allAvailableStations = ["Select station", ...apiStations];

  // Filter data based on selection
  const filteredData = selectedStation === "Select station"
    ? []
    : chartData.filter(item => String(item.station) === selectedStation);

  return (
    <div
      className="min-h-screen bg-slate-950 text-white pb-20"
      style={{ backgroundColor: "#0f172a", color: "#fff" }} // fallback if Tailwind not loaded
    >
      <div className="px-8 py-6" style={{ padding: "24px" }}>
        <h1 className="text-3xl font-bold mb-2">Live Water Quality Monitoring (OGD India)</h1>
        <p className="text-slate-400 text-sm mb-6">
          Real-time data fetched directly from CPCB via Open Government Data (OGD) Platform
        </p>

        {/* MAP SECTION */}
        <div
          className="bg-slate-800 rounded-2xl overflow-hidden mb-8"
          style={{ backgroundColor: "#1e293b", borderRadius: "16px" }}
        >
          <div
            className="p-4 border-b border-slate-700"
            style={{ padding: "16px", borderBottom: "1px solid #334155" }}
          >
            <h2 className="text-xl font-semibold">Monitoring Stations</h2>
          </div>
          <div
            className="h-[500px] w-full"
            style={{ height: "500px" }}
          >
            <Stationmap />
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="mt-16 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Environmental Parameters Trend</h2>
              </div>
            </div>

            {/* Station Selector - Premium Design */}
            <div className="relative group min-w-[280px]">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Active Monitoring Point
              </label>
              <div className="relative">
                <select
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 hover:border-blue-500 text-white rounded-xl px-5 py-3.5 appearance-none outline-none focus:ring-4 focus:ring-blue-500/20 transition-all cursor-pointer backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid #334155" }}
                >
                  {allAvailableStations.map(station => (
                    <option key={station} value={station} className="bg-slate-900">{station}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* SIDE-BY-SIDE CHARTS */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div
              className="lg:w-3/4 bg-slate-800/40 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 backdrop-blur-md p-8"
              style={{ backgroundColor: "rgba(30, 41, 59, 0.4)", borderRadius: "24px", border: "1px solid rgba(51, 65, 85, 0.5)" }}
            >
              <h3 className="text-xl font-bold mb-4 text-white">Water Quality Trends</h3>
              <WaterQualityChart data={filteredData} />
            </div>

            {/* RADAR CHART - 25% */}
            <div
              className="lg:w-1/4 bg-slate-800/40 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 backdrop-blur-md p-8"
              style={{ backgroundColor: "rgba(30, 41, 59, 0.4)", borderRadius: "24px", border: "1px solid rgba(51, 65, 85, 0.5)" }}
            >
              <WaterQualityRadar data={filteredData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}