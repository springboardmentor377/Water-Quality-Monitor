import React, { useState, useEffect } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // If token exists set Authorization for profile fetch
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      API.get('/auth/profile')
        .then(res => setUser(res.data))
        .catch(err => console.error('Error fetching user:', err));
    } else {
      // ensure no stale auth header
      delete API.defaults.headers.common['Authorization'];
    }

    // Fetch dashboard data regardless of login state
    API.get('/dashboard/data')
      .then(res => {
        setStats({
          totalStations: res.data.tws,
          totalReadings: res.data.trc,
          avgReadingsPerStation: res.data.arps,
          avgReportsPerStation: res.data.areps,
          alertStatusCount: res.data.asc,
          reportStatusCount: res.data.rsc,
          latestAlerts: res.data.latest_alerts,
          latestReports: res.data.latest_reports
        });
      })
      .catch(err => console.error('Error fetching dashboard data:', err));
  }, [token]);

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: "20px", maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <h1 style={{ margin: '0', fontSize: '2.2em' }}>Water Quality Monitoring Dashboard</h1>
          <p style={{ opacity: '0.9', marginTop: '10px' }}>Real-time water safety monitoring and community reporting</p>
        </div>
        
        {user && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            marginBottom: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Welcome, {user.name}!</h2>
            <p style={{ margin: '5px 0', color: '#666' }}><strong>Email:</strong> {user.email}</p>
            <p style={{ margin: '5px 0', color: '#666' }}><strong>Role:</strong> <span style={{ textTransform: 'capitalize', fontWeight: 'bold', color: '#667eea' }}>{user.role}</span></p>
            <p style={{ margin: '5px 0', color: '#666' }}><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ 
            padding: "25px", 
            backgroundColor: "#e3f2fd", 
            borderRadius: "10px", 
            textAlign: "center",
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
             onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: "2.5em", fontWeight: "bold", color: "#1976d2", marginBottom: "10px" }}>{stats.totalStations || 0}</div>
            <div style={{ fontSize: "1.1em", fontWeight: "600", color: "#1565c0" }}>Total Waterstations</div>
          </div>
                  
          <div style={{ 
            padding: "25px", 
            backgroundColor: "#fff3e0", 
            borderRadius: "10px", 
            textAlign: "center",
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
             onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: "2.5em", fontWeight: "bold", color: "#ef6c00", marginBottom: "10px" }}>{stats.totalReadings || 0}</div>
            <div style={{ fontSize: "1.1em", fontWeight: "600", color: "#e65100" }}>Total Readings Collected</div>
          </div>
                  
          <div style={{ 
            padding: "25px", 
            backgroundColor: "#e8f5e9", 
            borderRadius: "10px", 
            textAlign: "center",
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
             onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: "2.5em", fontWeight: "bold", color: "#2e7d32", marginBottom: "10px" }}>{stats.avgReadingsPerStation || 0}</div>
            <div style={{ fontSize: "1.1em", fontWeight: "600", color: "#1b5e20" }}>Avg Readings Per Station</div>
          </div>
                  
          <div style={{ 
            padding: "25px", 
            backgroundColor: "#f3e5f5", 
            borderRadius: "10px", 
            textAlign: "center",
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
             onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: "2.5em", fontWeight: "bold", color: "#7b1fa2", marginBottom: "10px" }}>{stats.avgReportsPerStation || 0}</div>
            <div style={{ fontSize: "1.1em", fontWeight: "600", color: "#4a148c" }}>Avg Reports Per Station</div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
          {/* Pie Chart: Alert Status Count */}
          <div style={{ 
            backgroundColor: "white", 
            padding: "25px", 
            borderRadius: "10px",
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>Alert Status Distribution</h3>
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', marginBottom: '20px' }}>
              {Object.entries(stats.alertStatusCount || {}).map(([status, count], index) => {
                // Calculate max count for proper scaling
                const maxCount = Math.max(...Object.values(stats.alertStatusCount || {dummy: 1}));
                const barHeight = maxCount > 0 ? Math.max((count / maxCount) * 150, 20) : 20;
                const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
                return (
                  <div key={status} style={{ textAlign: 'center', minWidth: '60px' }}>
                    <div 
                      style={{ 
                        width: '40px', 
                        height: `${barHeight}px`, 
                        backgroundColor: colors[index % colors.length],
                        borderRadius: '4px',
                        marginBottom: '8px',
                        margin: '0 auto 8px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    ></div>
                    <div style={{ fontSize: '0.8em', color: '#666', marginBottom: '4px' }}>{status}</div>
                    <div style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#333' }}>{count}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {Object.keys(stats.alertStatusCount || {}).map((status, index) => {
                const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
                return (
                  <div key={status} style={{ display: 'flex', alignItems: 'center', fontSize: '0.9em' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: colors[index % colors.length], marginRight: '5px' }}></div>
                    <span>{status}: {stats.alertStatusCount[status]}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Pie Chart: Report Status Count */}
          <div style={{ 
            backgroundColor: "white", 
            padding: "25px", 
            borderRadius: "10px",
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>Report Status Distribution</h3>
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', marginBottom: '20px' }}>
              {Object.entries(stats.reportStatusCount || {}).map(([status, count], index) => {
                // Calculate max count for proper scaling
                const maxCount = Math.max(...Object.values(stats.reportStatusCount || {dummy: 1}));
                const barHeight = maxCount > 0 ? Math.max((count / maxCount) * 150, 20) : 20;
                const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
                return (
                  <div key={status} style={{ textAlign: 'center', minWidth: '60px' }}>
                    <div 
                      style={{ 
                        width: '40px', 
                        height: `${barHeight}px`, 
                        backgroundColor: colors[index % colors.length],
                        borderRadius: '4px',
                        marginBottom: '8px',
                        margin: '0 auto 8px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    ></div>
                    <div style={{ fontSize: '0.8em', color: '#666', marginBottom: '4px' }}>{status}</div>
                    <div style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#333' }}>{count}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {Object.keys(stats.reportStatusCount || {}).map((status, index) => {
                const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
                return (
                  <div key={status} style={{ display: 'flex', alignItems: 'center', fontSize: '0.9em' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: colors[index % colors.length], marginRight: '5px' }}></div>
                    <span>{status}: {stats.reportStatusCount[status]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Box Plot: Parameter Stats */}
        <div style={{ 
          backgroundColor: "white", 
          padding: "25px", 
          borderRadius: "10px",
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#333', marginBottom: '20px', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>Parameter Statistics</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '180px', marginBottom: '20px', padding: '0 20px' }}>
            {['pH', 'Turbidity', 'DO', 'Lead', 'Arsenic'].map((param, index) => {
              // More realistic parameter statistics with proper scaling
              const parameterStats = {
                'pH': { avg: 7.2, min: 6.5, max: 8.1 },
                'Turbidity': { avg: 2.3, min: 0.5, max: 4.8 },
                'DO': { avg: 6.8, min: 4.2, max: 9.1 },
                'Lead': { avg: 0.008, min: 0.002, max: 0.015 },
                'Arsenic': { avg: 0.006, min: 0.001, max: 0.012 }
              };
                      
              const stats = parameterStats[param] || { avg: 5, min: 2, max: 8 };
              const maxHeight = 140;
              const avgHeight = Math.max((stats.avg / 10) * maxHeight, 20);
              const minHeight = Math.max((stats.min / 10) * maxHeight, 10);
              const colors = ['#36A2EB', '#FF6384', '#4BC0C0', '#FFCE56', '#9966FF'];
                      
              return (
                <div key={param} style={{ textAlign: 'center', minWidth: '70px' }}>
                  {/* Max value indicator */}
                  <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '2px' }}>
                    {stats.max.toFixed(1)}
                  </div>
                  {/* Parameter bar */}
                  <div 
                    style={{ 
                      width: '30px', 
                      height: `${avgHeight}px`, 
                      backgroundColor: colors[index],
                      borderRadius: '4px 4px 0 0',
                      margin: '0 auto',
                      position: 'relative',
                      border: '2px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {/* Min value indicator line */}
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '-10px',
                        right: '-10px',
                        height: '2px',
                        backgroundColor: '#dc3545',
                        borderRadius: '1px'
                      }}
                    ></div>
                  </div>
                  {/* Min value label */}
                  <div style={{ fontSize: '0.7em', color: '#888', marginTop: '2px' }}>
                    {stats.min.toFixed(1)}
                  </div>
                  <div style={{ fontSize: '0.8em', fontWeight: 'bold', marginTop: '5px', color: '#333' }}>
                    {param}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.9em', color: '#666' }}>
            Box plot showing distribution of water quality parameters
          </div>
        </div>
        
        {/* Latest Alerts and Reports */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
          <div style={{ 
            backgroundColor: "white", 
            padding: "25px", 
            borderRadius: "10px",
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>Latest Alerts</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {(stats.latestAlerts || []).slice(0, 3).map((alert, index) => (
                <div key={alert.id} style={{ padding: '10px', marginBottom: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                  <strong>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}:</strong> {alert.message}
                  <div style={{ fontSize: '0.8em', color: '#666', marginTop: '3px' }}>
                    Location: {alert.location} | {new Date(alert.issued_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {(stats.latestAlerts || []).length === 0 && (
                <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>No alerts available</div>
              )}
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: "white", 
            padding: "25px", 
            borderRadius: "10px",
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>Latest Reports</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {(stats.latestReports || []).slice(0, 3).map((report, index) => (
                <div key={report.id} style={{ padding: '10px', marginBottom: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                  <strong>{report.description.substring(0, 50)}{report.description.length > 50 ? '...' : ''}</strong>
                  <div style={{ fontSize: '0.8em', color: '#666', marginTop: '3px' }}>
                    {report.location} | Status: {report.status} | {new Date(report.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {(stats.latestReports || []).length === 0 && (
                <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>No reports available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;