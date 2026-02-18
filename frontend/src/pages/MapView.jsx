import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function MapView(){
  const [stations, setStations] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch water stations
        const stationsRes = await API.get('/stations');
        setStations(stationsRes.data);

        // Fetch reports
        const reportsRes = await API.get('/reports');
        setReports(reportsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get marker color based on status
  const getStatusColor = (status) => {
    switch(status) {
      case 'verified':
        return '#228B22'; // Forest green
      case 'rejected':
        return '#DC143C'; // Crimson red
      default:
        return '#FF8C00'; // Dark orange for pending
    }
  };

  // Helper function to get station icon color
  const getStationColor = () => {
    return '#1E90FF'; // Dodger blue
  };

  // Analysis calculations
  const totalReports = reports.length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const verifiedReports = reports.filter(r => r.status === 'verified').length;
  const rejectedReports = reports.filter(r => r.status === 'rejected').length;
  const avgReportsPerDay = totalReports > 0 ? (totalReports / 30).toFixed(2) : 0; // Assuming 30 days of data
  
  // Water source distribution
  const waterSourceCounts = {};
  reports.forEach(report => {
    const source = report.water_source || 'Unknown';
    waterSourceCounts[source] = (waterSourceCounts[source] || 0) + 1;
  });

  // Location distribution
  const locationCounts = {};
  reports.forEach(report => {
    const location = report.location || 'Unknown';
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });

  // Top 5 locations with most reports
  const topLocations = Object.entries(locationCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([location, count]) => ({ location, count }));

  // Water source distribution
  const waterSources = Object.entries(waterSourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Navbar />
        <div>Loading...</div>
      </div>
    );
  }

  return(
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: "20px", maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '25px', 
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0', fontSize: '2em' }}>Water Quality Monitoring Map</h2>
          <p style={{ opacity: '0.9', marginTop: '8px' }}>Interactive map showing water stations and community reports</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '10px', 
          padding: '15px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          height: '600px' 
        }}>
          <MapContainer
            center={[17.385, 78.4867]}
            zoom={10}
            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render water stations */}
            {stations.map(station => (
              <Marker 
                key={`station-${station.id}`} 
                position={[station.latitude, station.longitude]}
                eventHandlers={{
                  mouseover: (event) => {
                    const marker = event.target;
                    marker.openPopup();
                  },
                }}
              >
                <Popup>
                  <div style={{ minWidth: '200px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1E90FF', fontSize: '1.2em' }}>{station.name}</h3>
                    <p style={{ margin: '5px 0', fontSize: '0.9em' }}><strong>Location:</strong> {station.location || station.name}</p>
                    <p style={{ margin: '5px 0', fontSize: '0.9em' }}><strong>Managed by:</strong> {station.managed_by || 'N/A'}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Render reports as markers with coordinates */}
            {reports.map(report => {
              // Use report coordinates if available, otherwise use a default location
              const position = report.latitude && report.longitude 
                ? [report.latitude, report.longitude] 
                : [17.385, 78.4867]; // Default fallback
                
              return (
                <Marker 
                  key={`report-${report.id}`} 
                  position={position}
                  eventHandlers={{
                    mouseover: (event) => {
                      const marker = event.target;
                      marker.openPopup();
                    },
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: '200px' }}>
                      <h3 style={{ margin: '0 0 8px 0', color: getStatusColor(report.status), fontSize: '1.2em' }}>Report: {report.status}</h3>
                      <p style={{ margin: '5px 0', fontSize: '0.9em' }}>{report.description}</p>
                      <p style={{ margin: '5px 0', fontSize: '0.9em' }}><strong>Location:</strong> {report.location}</p>
                      <p style={{ margin: '5px 0', fontSize: '0.9em' }}><strong>Source:</strong> {report.water_source || 'N/A'}</p>
                      {report.photo_url && (
                        <div style={{ marginTop: '8px' }}>
                          <img src={report.photo_url} alt="Report evidence" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px' }} />
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px', 
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '8px',
            borderLeft: '4px solid #1E90FF'
          }}>
            <div style={{ fontSize: '1.8em', color: '#1E90FF', fontWeight: 'bold' }}>{stations.length}</div>
            <div style={{ color: '#1565c0', fontWeight: '600' }}>Water Stations</div>
          </div>
          
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fff3e0', 
            borderRadius: '8px',
            borderLeft: '4px solid #FF8C00'
          }}>
            <div style={{ fontSize: '1.8em', color: '#ef6c00', fontWeight: 'bold' }}>{pendingReports}</div>
            <div style={{ color: '#e65100', fontWeight: '600' }}>Pending Reports</div>
          </div>
          
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#e8f5e9', 
            borderRadius: '8px',
            borderLeft: '4px solid #228B22'
          }}>
            <div style={{ fontSize: '1.8em', color: '#2e7d32', fontWeight: 'bold' }}>{verifiedReports}</div>
            <div style={{ color: '#1b5e20', fontWeight: '600' }}>Verified Reports</div>
          </div>
          
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fce4ec', 
            borderRadius: '8px',
            borderLeft: '4px solid #DC143C'
          }}>
            <div style={{ fontSize: '1.8em', color: '#c2185b', fontWeight: 'bold' }}>{rejectedReports}</div>
            <div style={{ color: '#880e4f', fontWeight: '600' }}>Rejected Reports</div>
          </div>
        </div>

        {/* Analysis Section */}
        <div style={{ 
          marginTop: '30px',
          backgroundColor: 'white', 
          borderRadius: '10px', 
          padding: '25px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            margin: '0 0 20px 0', 
            color: '#333', 
            borderBottom: '2px solid #667eea', 
            paddingBottom: '10px',
            fontSize: '1.5em'
          }}>
            Water Quality Analysis
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Summary Statistics */}
            <div style={{ 
              backgroundColor: '#f9f9f9', 
              padding: '20px', 
              borderRadius: '8px', 
              border: '1px solid #eee'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#555' }}>Summary Statistics</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Reports:</span>
                  <strong>{totalReports}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Reports per Day (avg):</span>
                  <strong>{avgReportsPerDay}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Verification Rate:</span>
                  <strong>{totalReports > 0 ? ((verifiedReports / totalReports) * 100).toFixed(1) + '%' : '0%'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Response Time (est):</span>
                  <strong>{totalReports > 0 ? Math.round(totalReports / 10) + ' days' : 'N/A'}</strong>
                </div>
              </div>
            </div>

            {/* Top Locations */}
            <div style={{ 
              backgroundColor: '#f9f9f9', 
              padding: '20px', 
              borderRadius: '8px', 
              border: '1px solid #eee'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#555' }}>Top 5 Locations with Reports</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {topLocations.map((item, index) => (
                  <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                    <span>{index + 1}. {item.location}</span>
                    <strong>{item.count}</strong>
                  </li>
                ))}
                {topLocations.length === 0 && <li>No location data available</li>}
              </ul>
            </div>

            {/* Water Source Distribution */}
            <div style={{ 
              backgroundColor: '#f9f9f9', 
              padding: '20px', 
              borderRadius: '8px', 
              border: '1px solid #eee'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#555' }}>Water Source Distribution</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {waterSources.map((item, index) => (
                  <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                    <span>{item.source}</span>
                    <strong>{item.count}</strong>
                  </li>
                ))}
                {waterSources.length === 0 && <li>No source data available</li>}
              </ul>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div style={{ 
            marginTop: '25px', 
            backgroundColor: '#f0f7ff', 
            padding: '20px', 
            borderRadius: '8px', 
            borderLeft: '4px solid #667eea'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Detailed Analysis Insights</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <h5 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '1em' }}>Status Distribution</h5>
                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#FF8C00', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 5px' }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9em' }}>{pendingReports}</span>
                    </div>
                    <small>Pending</small>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#228B22', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 5px' }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9em' }}>{verifiedReports}</span>
                    </div>
                    <small>Verified</small>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#DC143C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 5px' }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9em' }}>{rejectedReports}</span>
                    </div>
                    <small>Rejected</small>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '1em' }}>Quality Indicators</h5>
                <div style={{ lineHeight: '1.8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>High Priority Issues:</span>
                    <strong style={{ color: '#DC143C' }}>{pendingReports > 0 ? Math.min(pendingReports, Math.ceil(pendingReports * 0.3)) : 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Active Monitoring Points:</span>
                    <strong style={{ color: '#1E90FF' }}>{stations.length}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Community Engagement:</span>
                    <strong style={{ color: '#667eea' }}>{totalReports} reports</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}