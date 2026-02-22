import { useEffect, useState } from "react";
import axios from "axios";
import "./NGOCollaboration.css";

interface NGOProject {
  id: number;
  ngo_name: string;
  project_name: string;
  contact_email: string;
  description: string;
  location: string;
  status: 'active' | 'completed' | 'planned';
  created_at: string;
  volunteers_count?: number;
  budget?: number;
}

export default function NGOCollaboration() {
  const [projects, setProjects] = useState<NGOProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({
    ngo_name: '',
    project_name: '',
    contact_email: '',
    description: '',
    location: '',
    status: 'planned' as 'active' | 'completed' | 'planned'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
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

    // Mock NGO Projects data
    const mockProjects = [
      {
        id: 1,
        ngo_name: "WaterAid India",
        project_name: "Ganga River Cleanup Initiative",
        contact_email: "contact@wateraid.in",
        description: "Comprehensive cleanup and monitoring of Ganga river water quality in Varanasi region",
        location: "Varanasi, Uttar Pradesh",
        status: "active" as const,
        created_at: "2024-01-15T10:30:00Z",
        volunteers_count: 45,
        budget: 2500000
      },
      {
        id: 2,
        ngo_name: "Clean Water Foundation",
        project_name: "Yamuna Water Quality Monitoring",
        contact_email: "info@cleanwater.org",
        description: "Real-time water quality monitoring and awareness programs along Yamuna river",
        location: "Delhi-NCR",
        status: "active" as const,
        created_at: "2024-02-01T09:15:00Z",
        volunteers_count: 32,
        budget: 1800000
      },
      {
        id: 3,
        ngo_name: "Environment Protection Society",
        project_name: "Godavari Basin Conservation",
        contact_email: "eps@godavari.org",
        description: "Conservation and pollution control in Godavari river basin",
        location: "Nashik, Maharashtra",
        status: "planned" as const,
        created_at: "2024-02-10T14:20:00Z",
        volunteers_count: 28,
        budget: 3200000
      },
      {
        id: 4,
        ngo_name: "River Guardians Trust",
        project_name: "Cauvery Water Restoration",
        contact_email: "trust@riverguardians.in",
        description: "Restoration of water quality and biodiversity in Cauvery river",
        location: "Mysore, Karnataka",
        status: "completed" as const,
        created_at: "2023-12-05T11:45:00Z",
        volunteers_count: 56,
        budget: 4200000
      },
      {
        id: 5,
        ngo_name: "Blue Water Initiative",
        project_name: "Krishna River Health Check",
        contact_email: "bluewater@krishna.org",
        description: "Health assessment and pollution monitoring of Krishna river",
        location: "Vijayawada, Andhra Pradesh",
        status: "active" as const,
        created_at: "2024-01-20T16:30:00Z",
        volunteers_count: 38,
        budget: 2100000
      }
    ];

    // Set mock data initially
    setProjects(mockProjects);
    setLoading(false);

    // Try to fetch from API
    axios.get("http://127.0.0.1:8000/api/ngo-projects", config)
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setProjects(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        // Keep using mock data
      });
  };

  const handleCreateProject = () => {
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

    axios.post("http://127.0.0.1:8000/api/ngo-project", newProject, config)
      .then(() => {
        alert("NGO project created successfully!");
        setShowCreateForm(false);
        setNewProject({
          ngo_name: '',
          project_name: '',
          contact_email: '',
          description: '',
          location: '',
          status: 'planned'
        });
        fetchProjects();
      })
      .catch((err) => {
        console.error("Error creating project:", err);
        const msg = err.response?.data?.detail || (typeof err.response?.data === 'string' ? err.response.data : "Failed to create project. Please try again.");
        alert(Array.isArray(msg) ? msg.join(", ") : msg);
      });
  };

  const filteredProjects = (projects || []).filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: '#00C49F',
      completed: '#0088FE',
      planned: '#FFBB28'
    };
    return colors[status as keyof typeof colors] || '#64748b';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: '🟢',
      completed: '✅',
      planned: '📋'
    };
    return icons[status as keyof typeof icons] || '⚪';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleContactNGO = (email: string, projectName: string) => {
    if (email) {
      window.location.href = `mailto:${email}?subject=Inquiry about ${encodeURIComponent(projectName)}`;
    } else {
      alert("No contact email available for this NGO.");
    }
  };

  const handleViewDetails = (projectId: number) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  if (loading) {
    return (
      <div className="ngo-collaboration">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="ngo-collaboration">
      <div className="ngo-header">
        <h2>🤝 NGO Collaboration Hub</h2>
        <p>Connect with NGOs working on water quality initiatives</p>
        
        <div className="ngo-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Projects ({projects.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({projects.filter(p => p.status === 'active').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'planned' ? 'active' : ''}`}
              onClick={() => setFilter('planned')}
            >
              Planned ({projects.filter(p => p.status === 'planned').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({projects.filter(p => p.status === 'completed').length})
            </button>
          </div>
          
          <button 
            className="create-project-btn"
            onClick={() => setShowCreateForm(true)}
          >
            ➕ Add Project
          </button>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="project-stats">
        <div className="stat-card active">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <h3>Active</h3>
            <p>{projects.filter(p => p.status === 'active').length}</p>
          </div>
        </div>
        <div className="stat-card planned">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Planned</h3>
            <p>{projects.filter(p => p.status === 'planned').length}</p>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p>{projects.filter(p => p.status === 'completed').length}</p>
          </div>
        </div>
        <div className="stat-card total">
          <div className="stat-icon">🌊</div>
          <div className="stat-content">
            <h3>Total</h3>
            <p>{projects.length}</p>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="featured-section">
        <h3>🌟 Featured Projects</h3>
        <div className="featured-grid">
          {projects.slice(0, 3).map((project) => (
            <div key={project.id} className="featured-card">
              <div className="featured-header">
                <h4>{project.project_name}</h4>
                <span className="status-badge" style={{ backgroundColor: getStatusColor(project.status) }}>
                  {getStatusIcon(project.status)} {project.status}
                </span>
              </div>
              <div className="featured-content">
                <p className="ngo-name">🏢 {project.ngo_name}</p>
                <p className="description">{project.description}</p>
                <div className="project-meta">
                  <span className="location">📍 {project.location}</span>
                  <span className="date">📅 {formatDateTime(project.created_at)}</span>
                </div>
              </div>
              <div className="featured-footer">
                <button 
                  className="contact-btn" 
                  onClick={() => handleContactNGO(project.contact_email, project.project_name)}
                >
                  📧 Contact NGO
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Projects List */}
      <div className="projects-list">
        <h3>📋 All NGO Projects</h3>
        {filteredProjects.length === 0 ? (
          <div className="no-projects">
            <p>No projects found</p>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="project-card"
                style={{ borderLeft: `4px solid ${getStatusColor(project.status)}` }}
              >
                <div className="project-header">
                  <div className="project-title">
                    <h4>{project.project_name}</h4>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(project.status) }}>
                      {getStatusIcon(project.status)} {project.status}
                    </span>
                  </div>
                  <div className="ngo-info">
                    <span className="ngo-name">🏢 {project.ngo_name}</span>
                  </div>
                </div>
                
                <div className="project-description">
                  <p>{project.description}</p>
                </div>

                <div className="project-details">
                  <div className="detail-item">
                    <span className="label">📍 Location:</span>
                    <span className="value">{project.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">📧 Contact:</span>
                    <span className="value">{project.contact_email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">📅 Started:</span>
                    <span className="value">{formatDateTime(project.created_at)}</span>
                  </div>
                  {expandedProjectId === project.id && (
                    <>
                      {project.volunteers_count && (
                        <div className="detail-item">
                          <span className="label">👥 Volunteers:</span>
                          <span className="value">{project.volunteers_count}</span>
                        </div>
                      )}
                      {project.budget && (
                        <div className="detail-item">
                          <span className="label">💰 Budget:</span>
                          <span className="value">₹{project.budget.toLocaleString()}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="project-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => handleContactNGO(project.contact_email, project.project_name)}
                  >
                    📧 Contact NGO
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => handleViewDetails(project.id)}
                  >
                    📊 {expandedProjectId === project.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add NGO Project</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>NGO Name</label>
                <input
                  type="text"
                  value={newProject.ngo_name}
                  onChange={(e) => setNewProject({...newProject, ngo_name: e.target.value})}
                  placeholder="Enter NGO name..."
                />
              </div>
              
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={newProject.project_name}
                  onChange={(e) => setNewProject({...newProject, project_name: e.target.value})}
                  placeholder="Enter project name..."
                />
              </div>
              
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  value={newProject.contact_email}
                  onChange={(e) => setNewProject({...newProject, contact_email: e.target.value})}
                  placeholder="Enter contact email..."
                />
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newProject.location}
                  onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                  placeholder="Enter project location..."
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Enter project description..."
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({...newProject, status: e.target.value as any})}
                >
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
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
                onClick={handleCreateProject}
                disabled={!newProject.ngo_name || !newProject.project_name || !newProject.contact_email}
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
