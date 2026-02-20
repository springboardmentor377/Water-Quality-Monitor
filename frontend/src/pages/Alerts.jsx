import React, { useState, useEffect } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [predictiveAlerts, setPredictiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    fetchPredictiveAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await API.get("/alerts");
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };
  
  const fetchPredictiveAlerts = async () => {
    try {
      const response = await API.get("/predictive-alerts");
      setPredictiveAlerts(response.data);
    } catch (error) {
      console.error("Error fetching predictive alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportForAlert = async (alertId) => {
    // Navigate to report creation page with alert ID
    window.location.href = `/submit?alert_id=${alertId}`;
  };

  const handleDeactivateAlert = async (alertId) => {
    try {
      await API.put(`/alerts/${alertId}/deactivate`);
      fetchAlerts(); // Refresh the list
    } catch (error) {
      console.error("Error deactivating alert:", error);
    }
  };
  
  const handleDeactivatePredictiveAlert = async (alertId) => {
    try {
      await API.put(`/predictive-alerts/${alertId}`, { is_active: false });
      fetchPredictiveAlerts(); // Refresh the list
    } catch (error) {
      console.error("Error deactivating predictive alert:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2>Loading alerts...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: "20px", maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
          color: 'white', 
          padding: '25px', 
          borderRadius: '10px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0', fontSize: '2em' }}>Water Quality Alerts</h2>
          <p style={{ opacity: '0.9', marginTop: '8px' }}>Monitor critical water quality issues and contamination warnings</p>
        </div>

        {/* Regular Alerts Section */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '1.5em' }}>Active Water Quality Alerts</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {alerts.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '40px', 
                backgroundColor: 'white', 
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <h3>No active alerts at this time</h3>
                <p>Water quality is within safe parameters</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div key={`regular-${alert.id}`} style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '10px', 
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  borderLeft: `5px solid ${alert.alert_type === 'contamination' ? '#ff6b6b' : alert.alert_type === 'boil_notice' ? '#ffa502' : '#e74c3c'}`,
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ 
                        margin: '0 0 10px 0', 
                        color: alert.alert_type === 'contamination' ? '#ff6b6b' : alert.alert_type === 'boil_notice' ? '#ffa502' : '#e74c3c',
                        fontSize: '1.3em'
                      }}>
                        {alert.alert_type === 'contamination' && '⚠️ Contamination Alert'}
                        {alert.alert_type === 'boil_notice' && '🌡️ Boil Notice'}
                        {alert.alert_type === 'outage' && '💧 Outage Alert'}
                      </h3>
                      <p style={{ margin: '10px 0', lineHeight: '1.6', color: '#555' }}>
                        {alert.message}
                      </p>
                      <div style={{ marginTop: '15px', fontSize: '0.9em', color: '#666' }}>
                        <p style={{ margin: '5px 0' }}><strong>Location:</strong> {alert.location}</p>
                        <p style={{ margin: '5px 0' }}><strong>Station ID:</strong> {alert.station_id || 'N/A'}</p>
                        <p style={{ margin: '5px 0' }}><strong>Issued:</strong> {new Date(alert.issued_at).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button 
                        onClick={() => handleReportForAlert(alert.id)}
                        style={{
                          backgroundColor: '#667eea',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.9em',
                          fontWeight: '500',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6fd8'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
                      >
                        Report
                      </button>
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
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Predictive Alerts Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: '0', color: '#333', fontSize: '1.5em' }}>Predictive Water Quality Alerts</h3>
            <button 
              onClick={() => {
                // Trigger prediction generation
                API.post('/predictive-alerts/generate')
                  .then(response => {
                    alert(`Generated ${response.data.alerts.length} predictive alerts`);
                    fetchPredictiveAlerts();
                  })
                  .catch(error => console.error('Error generating alerts:', error));
              }}
              style={{
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.9em',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6fd8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
            >
              Generate Predictions
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {predictiveAlerts.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '40px', 
                backgroundColor: 'white', 
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <h3>No predictive alerts at this time</h3>
                <p>Click "Generate Predictions" to analyze trends</p>
              </div>
            ) : (
              predictiveAlerts.map(alert => (
                <div key={`pred-${alert.id}`} style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '10px', 
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  borderLeft: `5px solid ${alert.risk_level === 'critical' ? '#dc3545' : alert.risk_level === 'high' ? '#fd7e14' : alert.risk_level === 'medium' ? '#ffc107' : '#28a745'}`,
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <h3 style={{ 
                          margin: '0', 
                          color: alert.risk_level === 'critical' ? '#dc3545' : alert.risk_level === 'high' ? '#fd7e14' : alert.risk_level === 'medium' ? '#ffc107' : '#28a745',
                          fontSize: '1.3em'
                        }}>
                          {alert.risk_level === 'critical' && '🚨 Critical Prediction'}
                          {alert.risk_level === 'high' && '⚠️ High Risk'}
                          {alert.risk_level === 'medium' && '🟡 Medium Risk'}
                          {alert.risk_level === 'low' && '🟢 Low Risk'}
                        </h3>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '15px',
                          fontSize: '0.8em',
                          backgroundColor: alert.risk_level === 'critical' ? '#f8d7da' : alert.risk_level === 'high' ? '#ffeaa7' : alert.risk_level === 'medium' ? '#fdcb6e' : '#d1f2eb',
                          color: alert.risk_level === 'critical' ? '#dc3545' : alert.risk_level === 'high' ? '#fd7e14' : alert.risk_level === 'medium' ? '#e67e22' : '#28a745',
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
                        <p style={{ margin: '5px 0' }}><strong>Predicted Value:</strong> {alert.predicted_value.toFixed(2)}</p>
                        <p style={{ margin: '5px 0' }}><strong>Confidence:</strong> {(alert.confidence_level * 100).toFixed(1)}%</p>
                        <p style={{ margin: '5px 0' }}><strong>Threshold Exceeded:</strong> {alert.threshold_exceeded ? 'Yes' : 'No'}</p>
                        <p style={{ margin: '5px 0' }}><strong>Expires:</strong> {new Date(alert.expires_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button 
                        onClick={() => handleDeactivatePredictiveAlert(alert.id)}
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
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}