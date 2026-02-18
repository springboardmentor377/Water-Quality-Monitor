import React, { useState, useEffect } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function NGOProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    project_name: "",
    contact_email: "",
    description: ""
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await API.get("/ngo-projects/");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      if (error.response?.status === 403) {
        alert("Access denied. Only NGO users can view projects.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/ngo-projects/", formData);
      setFormData({ project_name: "", contact_email: "", description: "" });
      setShowForm(false);
      fetchProjects(); // Refresh the list
    } catch (error) {
      console.error("Error creating project:", error);
      if (error.response?.status === 403) {
        alert("Access denied. Only NGO users can create projects.");
      } else {
        alert("Error creating project: " + (error.response?.data?.detail || error.message));
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: "20px", maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2>Loading NGO projects...</h2>
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
          <h2 style={{ margin: '0', fontSize: '2.2em' }}>NGO Projects Hub</h2>
          <p style={{ opacity: '0.9', marginTop: '8px', fontSize: '1.1em' }}>
            Manage and view water quality projects
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: '0', color: '#333' }}>My Projects</h3>
          <button 
            onClick={() => setShowForm(!showForm)}
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
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        </div>

        {/* Form for creating new project */}
        {showForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <h4 style={{ margin: '0 0 20px 0', color: '#333' }}>Create New Project</h4>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Project Name *</label>
                <input 
                  type="text" 
                  name="project_name" 
                  value={formData.project_name}
                  onChange={handleChange}
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
                  value={formData.contact_email}
                  onChange={handleChange}
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
                  value={formData.description}
                  onChange={handleChange}
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
              
              <button 
                type="submit"
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1em',
                  fontWeight: '500'
                }}
              >
                Create Project
              </button>
            </form>
          </div>
        )}

        {/* Projects List */}
        {projects.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '40px', 
            borderRadius: '10px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>No projects yet</h3>
            <p style={{ margin: '0', color: '#666' }}>Create your first project to get started</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {projects.map(project => (
              <div key={project.id} style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                borderLeft: '5px solid #667eea'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{project.project_name}</h4>
                    <p style={{ margin: '10px 0', color: '#666', fontSize: '0.9em' }}>
                      <strong>NGO:</strong> {project.ngo_name}
                    </p>
                    <p style={{ margin: '10px 0', color: '#666', fontSize: '0.9em' }}>
                      <strong>Contact:</strong> {project.contact_email}
                    </p>
                    {project.description && (
                      <p style={{ margin: '10px 0', color: '#555', lineHeight: '1.6' }}>
                        {project.description}
                      </p>
                    )}
                    <div style={{ marginTop: '15px', fontSize: '0.9em', color: '#666' }}>
                      <p style={{ margin: '5px 0' }}>
                        <strong>Status:</strong> 
                        <span style={{
                          marginLeft: '8px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8em',
                          backgroundColor: project.status === 'active' ? '#d4edda' : project.status === 'completed' ? '#cce5ff' : '#fff3cd',
                          color: project.status === 'active' ? '#155724' : project.status === 'completed' ? '#004085' : '#856404'
                        }}>
                          {project.status}
                        </span>
                      </p>
                      <p style={{ margin: '5px 0' }}>
                        <strong>Created:</strong> {new Date(project.created_at).toLocaleDateString()}
                      </p>
                      {project.start_date && (
                        <p style={{ margin: '5px 0' }}>
                          <strong>Start Date:</strong> {new Date(project.start_date).toLocaleDateString()}
                        </p>
                      )}
                      {project.end_date && (
                        <p style={{ margin: '5px 0' }}>
                          <strong>End Date:</strong> {new Date(project.end_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}