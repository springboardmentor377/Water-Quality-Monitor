import React, { useState, useEffect } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function NGODashboard() {
  const [collaborations, setCollaborations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    activeCollaborations: 0,
    totalProjects: 0,
    pendingReports: 0,
    resolvedIssues: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch collaborations
      const collabResponse = await API.get("/collaborations/");
      setCollaborations(collabResponse.data);
      
      // Mock projects data for now (would come from API in real implementation)
      const mockProjects = [
        { id: 1, name: "Clean Water Initiative", ngo: "Water Aid", status: "active", startDate: "2024-01-15", endDate: null },
        { id: 2, name: "Rural Water Access", ngo: "UNICEF", status: "active", startDate: "2024-02-01", endDate: null },
        { id: 3, name: "Contamination Cleanup", ngo: "Green Earth", status: "completed", startDate: "2023-11-10", endDate: "2024-01-20" }
      ];
      setProjects(mockProjects);
      
      // Calculate stats
      setStats({
        activeCollaborations: collabResponse.data.filter(c => c.status === 'active').length,
        totalProjects: mockProjects.length,
        pendingReports: 12, // Mock value
        resolvedIssues: 8   // Mock value
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollaboration = async (formData) => {
    try {
      await API.post("/collaborations/", formData);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error creating collaboration:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2>Loading NGO Dashboard...</h2>
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '30px', 
          borderRadius: '10px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0', fontSize: '2.2em' }}>NGO Collaboration Dashboard</h2>
          <p style={{ opacity: '0.9', marginTop: '8px', fontSize: '1.1em' }}>
            Manage partnerships and monitor water quality initiatives
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#667eea', fontSize: '2em' }}>{stats.activeCollaborations}</h3>
            <p style={{ margin: '0', color: '#666', fontWeight: '500' }}>Active Partnerships</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#667eea', fontSize: '2em' }}>{stats.totalProjects}</h3>
            <p style={{ margin: '0', color: '#666', fontWeight: '500' }}>Ongoing Projects</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ff6b6b', fontSize: '2em' }}>{stats.pendingReports}</h3>
            <p style={{ margin: '0', color: '#666', fontWeight: '500' }}>Pending Reports</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2ecc71', fontSize: '2em' }}>{stats.resolvedIssues}</h3>
            <p style={{ margin: '0', color: '#666', fontWeight: '500' }}>Resolved Issues</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Left Column - Collaborations and Projects */}
          <div>
            {/* Active Collaborations */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: '0', color: '#333' }}>Active Collaborations</h3>
                <button 
                  onClick={() => document.getElementById('createCollabModal').style.display = 'block'}
                  style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    fontWeight: '500'
                  }}
                >
                  + New Partnership
                </button>
              </div>
              
              {collaborations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                  <p>No active collaborations yet</p>
                  <p style={{ fontSize: '0.9em' }}>Start a partnership with another organization</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                  {collaborations.map(collab => (
                    <div key={collab.id} style={{
                      padding: '15px',
                      border: '1px solid #eee',
                      borderRadius: '8px',
                      backgroundColor: '#fafafa'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{collab.ngo_name}</h4>
                          <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                            <strong>Project:</strong> {collab.project_name}
                          </p>
                          <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                            <strong>Contact:</strong> {collab.contact_email}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8em',
                            backgroundColor: collab.status === 'active' ? '#d4edda' : collab.status === 'completed' ? '#cce5ff' : '#fff3cd',
                            color: collab.status === 'active' ? '#155724' : collab.status === 'completed' ? '#004085' : '#856404'
                          }}>
                            {collab.status}
                          </span>
                        </div>
                      </div>
                      {collab.description && (
                        <p style={{ margin: '10px 0 0 0', color: '#555', fontSize: '0.9em' }}>
                          {collab.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Projects */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Recent Projects</h3>
              
              <div style={{ display: 'grid', gap: '15px' }}>
                {projects.map(project => (
                  <div key={project.id} style={{
                    padding: '15px',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    backgroundColor: '#fafafa'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{project.name}</h4>
                        <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                          <strong>Partner:</strong> {project.ngo}
                        </p>
                        <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                          <strong>Period:</strong> {project.startDate} to {project.endDate || 'Present'}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8em',
                          backgroundColor: project.status === 'active' ? '#d4edda' : '#cce5ff',
                          color: project.status === 'active' ? '#155724' : '#004085'
                        }}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Quick Actions</h3>
              
              <div style={{ display: 'grid', gap: '15px' }}>
                <button 
                  onClick={() => window.location.href = '/alerts'}
                  style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '1em',
                    fontWeight: '500'
                  }}
                >
                  📢 View Water Alerts
                </button>
                
                <button 
                  onClick={() => window.location.href = '/reports'}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '1em',
                    fontWeight: '500'
                  }}
                >
                  📋 Review Reports
                </button>
                
                <button 
                  onClick={() => window.location.href = '/predictive-alerts'}
                  style={{
                    backgroundColor: '#ffc107',
                    color: '#212529',
                    border: 'none',
                    padding: '15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '1em',
                    fontWeight: '500'
                  }}
                >
                  📈 Predictive Analytics
                </button>
                
                <button 
                  onClick={() => window.location.href = '/map'}
                  style={{
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    padding: '15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '1em',
                    fontWeight: '500'
                  }}
                >
                  🗺️ View Water Stations
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Upcoming Events</h3>
              
              <div style={{ display: 'grid', gap: '15px' }}>
                <div style={{ padding: '10px', borderLeft: '4px solid #667eea' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Partnership Meeting</h4>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.9em' }}>Feb 20, 2024 • 10:00 AM</p>
                </div>
                
                <div style={{ padding: '10px', borderLeft: '4px solid #28a745' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Project Review</h4>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.9em' }}>Feb 22, 2024 • 2:00 PM</p>
                </div>
                
                <div style={{ padding: '10px', borderLeft: '4px solid #ffc107' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Data Analysis</h4>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.9em' }}>Feb 25, 2024 • 11:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for creating new collaboration */}
      <div id="createCollabModal" style={{
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          width: '500px',
          maxWidth: '90%'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>New Partnership</h3>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              ngo_name: e.target.ngo_name.value,
              project_name: e.target.project_name.value,
              contact_email: e.target.contact_email.value,
              description: e.target.description.value
            };
            handleCreateCollaboration(formData);
            document.getElementById('createCollabModal').style.display = 'none';
          }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>NGO Name *</label>
              <input 
                type="text" 
                name="ngo_name" 
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '1em'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Project Name *</label>
              <input 
                type="text" 
                name="project_name" 
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '1em'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Contact Email *</label>
              <input 
                type="email" 
                name="contact_email" 
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '1em'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description</label>
              <textarea 
                name="description"
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '1em'
                }}
              ></textarea>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                type="button"
                onClick={() => document.getElementById('createCollabModal').style.display = 'none'}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={{
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Create Partnership
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}