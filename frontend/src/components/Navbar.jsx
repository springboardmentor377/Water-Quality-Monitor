import { Link, useNavigate } from "react-router-dom";

export default function Navbar(){
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  // Get user role from token or local storage
  let userRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    } catch (e) {
      console.error("Error parsing token:", e);
    }
  }

  const logout = ()=>{
    localStorage.removeItem("token");
    navigate("/");
  }

  return(
    <nav className="navbar" style={{ 
      padding: "15px 30px", 
      backgroundColor: "#667eea", 
      borderBottom: "1px solid #5a6fd8",
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <Link to="/dashboard" style={{ 
            textDecoration: "none", 
            color: "white", 
            fontWeight: "bold",
            fontSize: "1.2em",
            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}>
            🌊 Water Quality Monitor
          </Link>
          
          <Link to="/dashboard" style={{ 
            textDecoration: "none", 
            color: "rgba(255,255,255,0.9)", 
            fontWeight: "500",
            transition: 'color 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.color = 'white'}
             onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
          >
            Dashboard
          </Link>
          
          <Link to="/alerts" style={{ 
            textDecoration: "none", 
            color: "rgba(255,255,255,0.9)", 
            fontWeight: "500",
            transition: 'color 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.color = 'white'}
             onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
          >
            Alerts
          </Link>
          
          <Link to="/history" style={{ 
            textDecoration: "none", 
            color: "rgba(255,255,255,0.9)", 
            fontWeight: "500",
            transition: 'color 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.color = 'white'}
             onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
          >
            Station History
          </Link>
          
          <Link to="/submit" style={{ 
            textDecoration: "none", 
            color: "rgba(255,255,255,0.9)", 
            fontWeight: "500",
            transition: 'color 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.color = 'white'}
             onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
          >
            Submit Report
          </Link>
          
          <Link to="/reports" style={{ 
            textDecoration: "none", 
            color: "rgba(255,255,255,0.9)", 
            fontWeight: "500",
            transition: 'color 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.color = 'white'}
             onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
          >
            Reports
          </Link>
          
          <Link to="/map" style={{ 
            textDecoration: "none", 
            color: "rgba(255,255,255,0.9)", 
            fontWeight: "500",
            transition: 'color 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.color = 'white'}
             onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
          >
            Map View
          </Link>
          
          {(userRole === 'authority' || userRole === 'admin' || userRole === 'ngo') && (
            <Link to="/review" style={{ 
              textDecoration: "none", 
              color: "rgba(255,255,255,0.9)", 
              fontWeight: "500",
              transition: 'color 0.2s'
            }} onMouseOver={(e) => e.currentTarget.style.color = 'white'}
               onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
            >
              Authority Review
            </Link>
          )}
          
          {(userRole === 'ngo' || userRole === 'admin') && (
            <Link to="/ngo-dashboard" style={{ 
              textDecoration: "none", 
              color: "rgba(255,255,255,0.9)", 
              fontWeight: "500",
              transition: 'color 0.2s'
            }} onMouseOver={(e) => e.currentTarget.style.color = 'white'}
               onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
            >
              NGO Dashboard
            </Link>
          )}
          
          {(userRole === 'ngo' || userRole === 'admin') && (
            <Link to="/ngo-projects" style={{ 
              textDecoration: "none", 
              color: "rgba(255,255,255,0.9)", 
              fontWeight: "500",
              transition: 'color 0.2s'
            }} onMouseOver={(e) => e.currentTarget.style.color = 'white'}
               onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
            >
              My Projects
            </Link>
          )}
          
          {(userRole === 'ngo' || userRole === 'admin' || userRole === 'authority') && (
            <Link to="/predictive-alerts" style={{ 
              textDecoration: "none", 
              color: "rgba(255,255,255,0.9)", 
              fontWeight: "500",
              transition: 'color 0.2s'
            }} onMouseOver={(e) => e.currentTarget.style.color = 'white'}
               onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
            >
              Predictive Analytics
            </Link>
          )}
        </div>
        
        <div>
          <button 
            onClick={logout} 
            style={{ 
              backgroundColor: "#dc3545", 
              color: "white", 
              border: "none", 
              padding: "8px 16px", 
              borderRadius: "5px", 
              cursor: "pointer",
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c82333"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#dc3545"}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}