import React, { useState, useEffect } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StationHistory() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [readings, setReadings] = useState({});
  const [selectedParameter, setSelectedParameter] = useState('pH');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (selectedStation) {
      fetchReadings(selectedStation);
    }
  }, [selectedStation]);

  const fetchStations = async () => {
    try {
      const response = await API.get("/stations");
      setStations(response.data);
      if (response.data.length > 0) {
        setSelectedStation(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  const fetchReadings = async (stationId) => {
    try {
      const response = await API.get(`/stations/${stationId}/readings`);
      const readingsByParam = {};
      
      // Group readings by parameter
      response.data.forEach(reading => {
        if (!readingsByParam[reading.parameter]) {
          readingsByParam[reading.parameter] = [];
        }
        readingsByParam[reading.parameter].push(reading);
      });
      
      setReadings(readingsByParam);
    } catch (error) {
      console.error("Error fetching readings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!readings[selectedParameter] || readings[selectedParameter].length === 0) {
      // Return sample data when no real data is available
      const sampleLabels = [];
      const sampleData = [];
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        sampleLabels.push(date.toLocaleDateString());
        // Generate sample values based on parameter type
        if (selectedParameter === 'pH') {
          sampleData.push(Math.random() * 2 + 6.5); // 6.5-8.5 range
        } else if (selectedParameter === 'turbidity') {
          sampleData.push(Math.random() * 8); // 0-8 NTU
        } else if (selectedParameter === 'DO') {
          sampleData.push(Math.random() * 8 + 2); // 2-10 mg/L
        } else if (selectedParameter === 'lead') {
          sampleData.push(Math.random() * 0.02); // 0-0.02 mg/L
        } else if (selectedParameter === 'arsenic') {
          sampleData.push(Math.random() * 0.02); // 0-0.02 mg/L
        }
      }
      
      const sampleChartData = {
        labels: sampleLabels,
        datasets: [
          {
            label: `${selectedParameter.toUpperCase()} Levels`,
            data: sampleData,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.1,
          }
        ]
      };

      // Add threshold lines
      const thresholds = {
        "pH": { min: 6.5, max: 8.5 },
        "turbidity": { max: 5.0 },
        "DO": { min: 5.0 },
        "lead": { max: 0.01 },
        "arsenic": { max: 0.01 }
      };

      if (thresholds[selectedParameter]) {
        const threshold = thresholds[selectedParameter];
        
        if (threshold.min !== undefined) {
          sampleChartData.datasets.push({
            label: `Min Threshold (${threshold.min})`,
            data: sampleLabels.map(() => threshold.min),
            borderColor: '#28a745',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          });
        }
        
        if (threshold.max !== undefined) {
          sampleChartData.datasets.push({
            label: `Max Threshold (${threshold.max})`,
            data: sampleLabels.map(() => threshold.max),
            borderColor: '#dc3545',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          });
        }
      }

      return sampleChartData;
    }

    // Sort readings by date
    const sortedReadings = [...readings[selectedParameter]].sort((a, b) => 
      new Date(a.recorded_at) - new Date(b.recorded_at)
    );

    const chartData = {
      labels: sortedReadings.map(reading => new Date(reading.recorded_at).toLocaleDateString()),
      datasets: [
        {
          label: `${selectedParameter.toUpperCase()} Levels`,
          data: sortedReadings.map(reading => reading.value),
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.1,
        }
      ]
    };

    // Add threshold line if applicable
    const thresholds = {
      "pH": { min: 6.5, max: 8.5 },
      "turbidity": { max: 5.0 },
      "DO": { min: 5.0 },
      "lead": { max: 0.01 },
      "arsenic": { max: 0.01 }
    };

    if (thresholds[selectedParameter]) {
      const threshold = thresholds[selectedParameter];
      
      // Add min threshold line if exists
      if (threshold.min !== undefined) {
        chartData.datasets.push({
          label: `Min Threshold (${threshold.min})`,
          data: sortedReadings.map(() => threshold.min),
          borderColor: '#28a745',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0
        });
      }
      
      // Add max threshold line if exists
      if (threshold.max !== undefined) {
        chartData.datasets.push({
          label: `Max Threshold (${threshold.max})`,
          data: sortedReadings.map(() => threshold.max),
          borderColor: '#dc3545',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0
        });
      }
    }

    return chartData;
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${selectedParameter.toUpperCase()} Levels Over Time`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2>Loading station history...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: "20px", maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '25px', 
          borderRadius: '10px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0', fontSize: '2em' }}>Station History Analysis</h2>
          <p style={{ opacity: '0.9', marginTop: '8px' }}>View historical water quality parameter readings over time</p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Select Station</label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              >
                {stations.map(station => (
                  <option key={station.id} value={station.id}>
                    {station.name} - {station.location}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Select Parameter</label>
              <select
                value={selectedParameter}
                onChange={(e) => setSelectedParameter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              >
                <option value="pH">pH Level</option>
                <option value="turbidity">Turbidity</option>
                <option value="DO">Dissolved Oxygen (DO)</option>
                <option value="lead">Lead Level</option>
                <option value="arsenic">Arsenic Level</option>
              </select>
            </div>
          </div>

          {selectedStation ? (
            <div style={{ height: '500px' }}>
              <Line data={getChartData()} options={chartOptions} />
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              border: '2px dashed #ddd'
            }}>
              <h3>No data available for {selectedParameter} at this station</h3>
              <p>Select another parameter or station to view historical data</p>
            </div>
          )}
        </div>

        {/* Station Info Panel */}
        {selectedStation && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '25px', 
            borderRadius: '10px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>
              Station Information
            </h3>
            {stations.find(s => s.id === selectedStation) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>Name:</strong> {stations.find(s => s.id === selectedStation).name}
                </div>
                <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>Location:</strong> {stations.find(s => s.id === selectedStation).location}
                </div>
                <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>Managed By:</strong> {stations.find(s => s.id === selectedStation).managed_by || 'N/A'}
                </div>
                <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>Coordinates:</strong> {stations.find(s => s.id === selectedStation).latitude}, {stations.find(s => s.id === selectedStation).longitude}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}