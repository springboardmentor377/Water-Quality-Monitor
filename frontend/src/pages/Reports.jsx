import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function Reports(){

  const [reports, setReports] = useState([]);

  useEffect(()=>{
    API.get("/reports")
    .then(res=>setReports(res.data))
    .catch(error => {
      console.error("Error loading reports:", error);
    });
  }, []);

  // Function to get status badge style
  const getStatusBadge = (status) => {
    switch(status) {
      case 'verified':
        return { 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          border: '1px solid #c3e6cb',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.8em',
          fontWeight: 'bold'
        };
      case 'rejected':
        return { 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          border: '1px solid #f5c6cb',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.8em',
          fontWeight: 'bold'
        };
      default:
        return { 
          backgroundColor: '#fff3cd', 
          color: '#856404', 
          border: '1px solid #ffeaa7',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.8em',
          fontWeight: 'bold'
        };
    }
  };

  return(
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ padding: "20px", maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '25px', 
          borderRadius: '10px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0', fontSize: '2em' }}>Water Quality Reports</h2>
          <p style={{ opacity: '0.9', marginTop: '8px' }}>Community-submitted water quality observations</p>
        </div>
        
        {reports.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '40px', 
            borderRadius: '10px', 
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3>No reports available yet.</h3>
            <p>Be the first to submit a water quality report!</p>
            <a href="/submit" style={{ 
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#667eea',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              marginTop: '10px'
            }}>Submit Report</a>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {reports.map(r => (
              <div key={r.id} className="p-4 border mb-3 rounded-lg shadow-sm" style={{ 
                border: "1px solid #ddd", 
                borderRadius: "10px", 
                margin: "10px 0", 
                backgroundColor: "#fff",
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                position: 'relative'
              }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} 
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: '0', color: '#333', fontSize: '1.3em' }}>{r.location}</h3>
                  <span style={getStatusBadge(r.status)}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                </div>
                <p style={{ margin: '10px 0', lineHeight: '1.6', color: '#555' }}>{r.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
                  {r.water_source && (
                    <div style={{ padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '5px', borderLeft: '3px solid #667eea' }}>
                      <strong style={{ color: '#667eea', fontSize: '0.9em' }}>Water Source:</strong>
                      <div style={{ marginTop: '3px', fontSize: '0.95em', color: '#555' }}>{r.water_source}</div>
                    </div>
                  )}
                  {r.latitude && r.longitude && (
                    <div style={{ padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '5px', borderLeft: '3px solid #28a745' }}>
                      <strong style={{ color: '#28a745', fontSize: '0.9em' }}>Coordinates:</strong>
                      <div style={{ marginTop: '3px', fontSize: '0.95em', color: '#555' }}>{r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}</div>
                    </div>
                  )}
                </div>
                <div style={{ 
                  marginTop: '15px', 
                  paddingTop: '10px', 
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#888',
                  fontSize: '0.9em'
                }}>
                  <span>Submitted: {new Date(r.created_at).toLocaleString()}</span>
                  {r.photo_url && (
                    <img src={r.photo_url} alt="Report evidence" style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "5px", border: "1px solid #ddd" }} onError={(e) => e.target.style.display='none'} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}