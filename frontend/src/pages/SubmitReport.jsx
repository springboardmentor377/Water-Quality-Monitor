import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function SubmitReport(){

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [waterSource, setWaterSource] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [alertId, setAlertId] = useState(null); // For reporting an existing alert

  // Check if we're creating a report for an alert
  useEffect(() => {
    const alert_id = searchParams.get('alert_id');
    if (alert_id) {
      setAlertId(parseInt(alert_id));
    }
  }, [searchParams]);

  const submit = async ()=>{
    try {
      await API.post("/reports",{
        location,
        latitude: parseFloat(latitude) || null,
        longitude: parseFloat(longitude) || null,
        description,
        water_source: waterSource,
        photo_url: photoUrl,
        alert_id: alertId  // Include alert ID if this report is for an alert
      });
      
      alert("Report submitted successfully!");
      if (alertId) {
        // If this was a report for an alert, go back to alerts page
        navigate("/alerts");
      } else {
        navigate("/reports");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit report: " + (error.response?.data?.detail || "Unknown error"));
    }
  }

  return(
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ padding: "20px", maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '25px', 
          borderRadius: '10px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0', fontSize: '2em' }}>
            {alertId ? 'Report for Alert' : 'Submit Water Quality Report'}
          </h2>
          <p style={{ opacity: '0.9', marginTop: '8px' }}>
            {alertId 
              ? 'Provide additional details for the selected alert' 
              : 'Help us monitor water quality by reporting issues in your area'}
          </p>
        </div>
        
        {alertId && (
          <div style={{ 
            backgroundColor: '#fff3cd', 
            color: '#856404', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #ffeaa7'
          }}>
            <strong>Note:</strong> This report is linked to Alert ID: {alertId}
          </div>
        )}
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Location *</label>
              <input
                type="text"
                placeholder="Enter location (e.g., Beach Road, Visakhapatnam)"
                value={location}
                onChange={(e)=>setLocation(e.target.value)}
                required
                style={{ 
                  width: "100%", 
                  padding: "12px", 
                  border: "1px solid #ddd", 
                  borderRadius: "5px",
                  fontSize: '16px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: "20px" }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Latitude (optional)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Enter latitude (e.g., 17.3850)"
                  value={latitude}
                  onChange={(e)=>setLatitude(e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "12px", 
                    border: "1px solid #ddd", 
                    borderRadius: "5px",
                    fontSize: '16px',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Longitude (optional)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Enter longitude (e.g., 78.4867)"
                  value={longitude}
                  onChange={(e)=>setLongitude(e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "12px", 
                    border: "1px solid #ddd", 
                    borderRadius: "5px",
                    fontSize: '16px',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Description *</label>
              <textarea
                placeholder="Describe the water quality issue in detail..."
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                required
                rows="5"
                style={{ 
                  width: "100%", 
                  padding: "12px", 
                  border: "1px solid #ddd", 
                  borderRadius: "5px",
                  fontSize: '16px',
                  resize: 'vertical',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: "20px" }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Water Source (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., River, Lake, Tap water, Ground water"
                  value={waterSource}
                  onChange={(e)=>setWaterSource(e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "12px", 
                    border: "1px solid #ddd", 
                    borderRadius: "5px",
                    fontSize: '16px',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Photo URL (optional)</label>
                <input
                  type="text"
                  placeholder="URL to photo (if any)"
                  value={photoUrl}
                  onChange={(e)=>setPhotoUrl(e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "12px", 
                    border: "1px solid #ddd", 
                    borderRadius: "5px",
                    fontSize: '16px',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>
            </div>

            <button 
              type="submit"
              style={{ 
                width: "100%", 
                padding: "15px", 
                backgroundColor: "#28a745", 
                color: "white", 
                border: "none", 
                borderRadius: "5px", 
                cursor: "pointer", 
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#218838"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#28a745"}
            >
              Submit Report
            </button>
          </form>
        </div>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '10px', 
          borderLeft: '4px solid #667eea',
          marginTop: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Reporting Guidelines</h3>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#555' }}>
            <li>Provide accurate location details</li>
            <li>Include specific information about the water quality issue</li>
            <li>Add coordinates if you know them (use maps app to find them)</li>
            <li>Attach photos if available to support your report</li>
            {alertId && <li>This report will be linked to Alert ID: {alertId}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}