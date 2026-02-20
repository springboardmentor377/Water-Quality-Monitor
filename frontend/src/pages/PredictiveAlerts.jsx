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

export default function PredictiveAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterParameter, setFilterParameter] = useState('all');

  useEffect(() => {
    fetchPredictiveAlerts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [alerts, filterRisk, filterParameter]);

  const fetchPredictiveAlerts = async () => {
    try {
      const response = await API.get("/predictive-alerts/");
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching predictive alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...alerts];
    
    if (filterRisk !== 'all') {
      filtered = filtered.filter(alert => alert.risk_level === filterRisk);
    }
    
    if (filterParameter !== 'all') {
      filtered = filtered.filter(alert => alert.parameter === filterParameter);
    }
    
    setFilteredAlerts(filtered);
  };

  const generatePredictiveAlerts = async () => {
    try {
      const response = await API.post("/predictive-alerts/generate");
      alert(`Generated ${response.data.alerts.length} predictive alerts`);
      fetchPredictiveAlerts(); // Refresh the list
    } catch (error) {
      console.error("Error generating predictive alerts:", error);
    }
  };

  const handleDeactivateAlert = async (alertId) => {
    try {
      await API.put(`/predictive-alerts/${alertId}`, { is_active: false });
      fetchPredictiveAlerts(); // Refresh the list
    } catch (error) {
      console.error("Error deactivating alert:", error);
    }
  };

  // Chart state per alert
  const [chartDataMap, setChartDataMap] = useState({});
  const [showChartMap, setShowChartMap] = useState({});

  const fetchAlertSeries = async (alertId) => {
    try {
      const res = await API.get(`/predictive-alerts/${alertId}/series`);
      const { labels, values } = res.data;

      // Split into historical and predicted (last 3 are predicted/past-predicted)
      const predictedIndex = labels.length - 3; // predicted point index

      const histLabels = labels.slice(0, predictedIndex + 1); // include predicted point in second dataset
      const histValues = values.slice(0, predictedIndex + 1);

      const predLabels = labels.slice(predictedIndex);
      const predValues = values.slice(predictedIndex);

      const data = {
        labels: labels.map(l => new Date(l).toLocaleString()),
        datasets: [
          {
            label: 'Historical',
            data: values.map((v, i) => (i < predictedIndex ? v : null)),
            borderColor: '#667eea',
            backgroundColor: 'rgba(102,126,234,0.2)',
            tension: 0.3,
            pointRadius: 2,
          },
          {
            label: 'Predicted',
            data: values.map((v, i) => (i >= predictedIndex ? v : null)),
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231,76,60,0.15)',
            borderDash: [6, 4],
            tension: 0.3,
            pointRadius: 4,
          }
        ]
      };

      setChartDataMap(prev => ({ ...prev, [alertId]: data }));
      setShowChartMap(prev => ({ ...prev, [alertId]: true }));
    } catch (error) {
      console.error('Error fetching alert series:', error);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch(riskLevel) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getRiskBgColor = (riskLevel) => {
    switch(riskLevel) {
      case 'critical': return '#f8d7da';
      case 'high': return '#ffeaa7';
      case 'medium': return '#fdcb6e';
      case 'low': return '#d1f2eb';
      default: return '#e9ecef';
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2>Loading predictive alerts...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: "20px", maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '10px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0', fontSize: '2.2em' }}>Predictive Water Quality Analytics</h2>
          <p style={{ opacity: '0.9', marginTop: '8px', fontSize: '1.1em' }}>
            Advanced analytics and predictive modeling for early contamination detection
          </p>
        </div>

        {/* Controls */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Risk Level</label>
              <select 
                value={filterRisk} 
                onChange={(e) => setFilterRisk(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '0.9em'
                }}
              >
                <option value="all">All Risks</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Parameter</label>
              <select 
                value={filterParameter} 
                onChange={(e) => setFilterParameter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '0.9em'
                }}
              >
                <option value="all">All Parameters</option>
                <option value="pH">pH</option>
                <option value="turbidity">Turbidity</option>
                <option value="DO">Dissolved Oxygen</option>
                <option value="lead">Lead</option>
                <option value="arsenic">Arsenic</option>
              </select>
            </div>
          </div>
          
          <button 
            onClick={generatePredictiveAlerts}
            style={{
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: '500'
            }}
          >
            📊 Generate Predictions
          </button>
        </div>

        {/* Stats Summary */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px', 
          marginBottom: '30px' 
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#3498db', fontSize: '1.8em' }}>
              {filteredAlerts.length}
            </h3>
            <p style={{ margin: '0', color: '#666', fontSize: '0.9em' }}>Total Predictions</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#e74c3c', fontSize: '1.8em' }}>
              {filteredAlerts.filter(a => a.risk_level === 'critical' || a.risk_level === 'high').length}
            </h3>
            <p style={{ margin: '0', color: '#666', fontSize: '0.9em' }}>High Risk Alerts</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#f39c12', fontSize: '1.8em' }}>
              {filteredAlerts.filter(a => a.threshold_exceeded).length}
            </h3>
            <p style={{ margin: '0', color: '#666', fontSize: '0.9em' }}>Threshold Exceeded</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#2ecc71', fontSize: '1.8em' }}>
              {Math.round((filteredAlerts.length > 0 ? 
                filteredAlerts.reduce((sum, a) => sum + a.confidence_level, 0) / filteredAlerts.length * 100 : 0))}
            </h3>
            <p style={{ margin: '0', color: '#666', fontSize: '0.9em' }}>Avg Confidence %</p>
          </div>
        </div>

        {/* Alerts List */}
        <div>
          {filteredAlerts.length === 0 ? (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '40px', 
              borderRadius: '10px', 
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>No predictive alerts found</h3>
              <p style={{ margin: '0', color: '#666' }}>Generate predictions or adjust your filters</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
              gap: '20px' 
            }}>
              {filteredAlerts.map(alert => (
                <div key={alert.id} style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '10px', 
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  borderLeft: `5px solid ${getRiskColor(alert.risk_level)}`,
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <h3 style={{ 
                          margin: '0', 
                          color: getRiskColor(alert.risk_level),
                          fontSize: '1.3em'
                        }}>
                          {alert.risk_level === 'critical' && '🚨 Critical Alert'}
                          {alert.risk_level === 'high' && '⚠️ High Risk'}
                          {alert.risk_level === 'medium' && '🟡 Medium Risk'}
                          {alert.risk_level === 'low' && '🟢 Low Risk'}
                        </h3>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '15px',
                          fontSize: '0.8em',
                          backgroundColor: getRiskBgColor(alert.risk_level),
                          color: getRiskColor(alert.risk_level),
                          fontWeight: 'bold'
                        }}>
                          {alert.parameter.toUpperCase()}
                        </span>
                      </div>
                      
                      {alert.alert_message && (
                        <p style={{ 
                          margin: '10px 0', 
                          lineHeight: '1.6', 
                          color: '#555',
                          fontStyle: 'italic'
                        }}>
                          "{alert.alert_message}"
                        </p>
                      )}
                      
                      <div style={{ marginTop: '15px', fontSize: '0.9em', color: '#666' }}>
                        <p style={{ margin: '5px 0' }}>
                          <strong>Predicted Value:</strong> {alert.predicted_value.toFixed(2)}
                        </p>
                        <p style={{ margin: '5px 0' }}>
                          <strong>Confidence:</strong> {(alert.confidence_level * 100).toFixed(1)}%
                        </p>
                        <p style={{ margin: '5px 0' }}>
                          <strong>Model Used:</strong> {alert.model_used || 'N/A'}
                        </p>
                        <p style={{ margin: '5px 0' }}>
                          <strong>Expires:</strong> {new Date(alert.expires_at).toLocaleDateString()}
                        </p>
                        <p style={{ margin: '5px 0' }}>
                          <strong>Threshold Exceeded:</strong> {alert.threshold_exceeded ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                    
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button 
                        onClick={() => handleDeactivateAlert(alert.id)}
                        style={{
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.9em',
                          fontWeight: '500',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={() => {
                          // toggle chart visibility; fetch if not present
                          if (!chartDataMap[alert.id]) fetchAlertSeries(alert.id);
                          else setShowChartMap(prev => ({ ...prev, [alert.id]: !prev[alert.id] }));
                        }}
                        style={{
                          backgroundColor: '#2d9cdb',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.9em',
                          fontWeight: '500',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        View Chart
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ 
                    marginTop: '15px', 
                    paddingTop: '15px', 
                    borderTop: '1px solid #eee',
                    fontSize: '0.85em',
                    color: '#888'
                  }}>
                    <p style={{ margin: '0' }}>
                      <strong>Generated:</strong> {new Date(alert.predicted_at).toLocaleString()}
                    </p>
                  </div>
                  {showChartMap[alert.id] && chartDataMap[alert.id] && (
                    <div style={{ marginTop: '18px' }}>
                      <Line
                        data={chartDataMap[alert.id]}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: `${alert.parameter} — Station ${alert.station_id}` }
                          },
                          scales: {
                            y: { beginAtZero: false }
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}