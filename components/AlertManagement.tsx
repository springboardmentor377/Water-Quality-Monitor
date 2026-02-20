import { useEffect, useState } from "react";
import axios from "axios";
import "./AlertManagement.css";

interface Alert {
  id: number;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  station_id?: number;
  created_at: string;
  expires_at?: string;
  active: boolean;
}

export default function AlertManagement() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newAlert, setNewAlert] = useState({
    message: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    location: '',
    station_id: 0
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No authentication token found");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.get("http://127.0.0.1:8000/alerts", config)
      .then((res) => {
        setAlerts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching alerts:", err);
        setLoading(false);
      });
  };

  const handleCreateAlert = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please login first");
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios.post("http://127.0.0.1:8000/alert", newAlert, config)
      .then(() => {
        alert("Alert created successfully!");
        setShowCreateForm(false);
        setNewAlert({
          message: '',
          severity: 'medium',
          location: '',
          station_id: 0
        });
        fetchAlerts();
      })
      .catch((err) => {
        console.error("Error creating alert:", err);
        alert("Error creating alert");
      });
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'active') return alert.active;
    if (filter === 'expired') return !alert.active;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: '#00C49F',
      medium: '#FFBB28',
      high: '#FF8042',
      critical: '#dc2626'
    };
    return colors[severity as keyof typeof colors] || '#64748b';
  };

  const getSeverityIcon = (severity: string) => {
    const icons = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴'
    };
    return icons[severity as keyof typeof icons] || '⚪';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="alert-management">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="alert-management">
      <div className="alert-header">
        <h2>🚨 Alert Management</h2>
        <p>Monitor and manage water quality alerts</p>
        
        <div className="alert-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({alerts.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({alerts.filter(a => a.active).length})
            </button>
            <button 
              className={`filter-btn ${filter === 'expired' ? 'active' : ''}`}
              onClick={() => setFilter('expired')}
            >
              Expired ({alerts.filter(a => !a.active).length})
            </button>
          </div>
          
          <button 
            className="create-alert-btn"
            onClick={() => setShowCreateForm(true)}
          >
            ➕ Create Alert
          </button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="alert-stats">
        <div className="stat-card critical">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <h3>Critical</h3>
            <p>{alerts.filter(a => a.severity === 'critical').length}</p>
          </div>
        </div>
        <div className="stat-card high">
          <div className="stat-icon">🟠</div>
          <div className="stat-content">
            <h3>High</h3>
            <p>{alerts.filter(a => a.severity === 'high').length}</p>
          </div>
        </div>
        <div className="stat-card medium">
          <div className="stat-icon">🟡</div>
          <div className="stat-content">
            <h3>Medium</h3>
            <p>{alerts.filter(a => a.severity === 'medium').length}</p>
          </div>
        </div>
        <div className="stat-card low">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <h3>Low</h3>
            <p>{alerts.filter(a => a.severity === 'low').length}</p>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="alerts-list">
        <h3>Recent Alerts</h3>
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts">
            <p>No alerts found</p>
          </div>
        ) : (
          <div className="alerts-grid">
            {filteredAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`alert-card ${alert.active ? 'active' : 'expired'}`}
                style={{ borderLeft: `4px solid ${getSeverityColor(alert.severity)}` }}
              >
                <div className="alert-header-info">
                  <div className="alert-severity">
                    <span className="severity-icon">{getSeverityIcon(alert.severity)}</span>
                    <span className="severity-text">{alert.severity.toUpperCase()}</span>
                  </div>
                  <div className="alert-status">
                    <span className={`status-badge ${alert.active ? 'active' : 'expired'}`}>
                      {alert.active ? 'Active' : 'Expired'}
                    </span>
                  </div>
                </div>
                
                <div className="alert-message">
                  <p>{alert.message}</p>
                </div>
                
                <div className="alert-details">
                  <div className="detail-item">
                    <span className="label">📍 Location:</span>
                    <span className="value">{alert.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">📅 Created:</span>
                    <span className="value">{formatDateTime(alert.created_at)}</span>
                  </div>
                  {alert.expires_at && (
                    <div className="detail-item">
                      <span className="label">⏰ Expires:</span>
                      <span className="value">{formatDateTime(alert.expires_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Alert</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Alert Message</label>
                <textarea
                  value={newAlert.message}
                  onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                  placeholder="Enter alert message..."
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label>Severity</label>
                <select
                  value={newAlert.severity}
                  onChange={(e) => setNewAlert({...newAlert, severity: e.target.value as any})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newAlert.location}
                  onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
                  placeholder="Enter location..."
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-btn"
                onClick={handleCreateAlert}
                disabled={!newAlert.message || !newAlert.location}
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
