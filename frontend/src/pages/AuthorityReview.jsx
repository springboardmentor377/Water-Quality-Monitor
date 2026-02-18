import React, { useEffect, useState } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';

const AuthorityReview = () => {
    const [reports, setReports] = useState([]);

    const load = () => API.get('/reports').then(res => setReports(res.data));
    useEffect(() => { load(); }, []);

    const handle = async (id, status) => {
        try {
            await API.put(`/reports/${id}`, {
                status: status ? 'verified' : 'rejected'
            });
            load(); // Refresh the list
        } catch (error) {
            console.error("Error updating report:", error);
            alert("Failed to update report: " + (error.response?.data?.detail || "Unknown error"));
        }
    };

    return (
        <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            <Navbar />
            <div className="p-6" style={{ padding: "20px", maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white', 
                    padding: '25px', 
                    borderRadius: '10px',
                    marginBottom: '30px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ margin: '0', fontSize: '2em' }}>Authority Report Review</h2>
                    <p style={{ opacity: '0.9', marginTop: '8px' }}>Review and approve community-submitted water quality reports</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ 
                            color: '#333', 
                            marginBottom: '20px', 
                            paddingBottom: '10px', 
                            borderBottom: '2px solid #667eea',
                            fontSize: '1.5em'
                        }}>Pending Reviews</h3>
                        
                        {reports.filter(r => r.status === 'pending').length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                <h4>No pending reports to review</h4>
                                <p>All reports have been reviewed</p>
                            </div>
                        ) : (
                            reports.filter(r => r.status === 'pending').map(r => (
                                <div key={r.id} className="p-4 border mb-2 flex justify-between items-center shadow-sm" style={{
                                    border: "1px solid #ddd",
                                    padding: "20px",
                                    margin: "10px 0",
                                    borderRadius: "8px",
                                    backgroundColor: "#fff",
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    transition: 'box-shadow 0.2s'
                                }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
                                   onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)'}
                                >
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{r.location}</h4>
                                        <p style={{ margin: '8px 0', color: '#555', lineHeight: '1.5' }}>{r.description}</p>
                                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
                                            {r.water_source && <span><strong>Source:</strong> {r.water_source}</span>}
                                            {r.latitude && r.longitude && <span><strong>Coord:</strong> {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}</span>}
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <button 
                                            onClick={() => handle(r.id, true)} 
                                            className="bg-green-500 text-white px-4 py-2 rounded" 
                                            style={{
                                                backgroundColor: "#28a745",
                                                color: "white",
                                                border: "none",
                                                padding: "10px 15px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                fontWeight: '600',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#218838"}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#28a745"}
                                        >
                                            ✓ Verify
                                        </button>
                                        <button 
                                            onClick={() => handle(r.id, false)} 
                                            className="bg-red-500 text-white px-4 py-2 rounded" 
                                            style={{
                                                backgroundColor: "#dc3545",
                                                color: "white",
                                                border: "none",
                                                padding: "10px 15px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                fontWeight: '600',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#c82333"}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#dc3545"}
                                        >
                                            ✗ Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ 
                            color: '#333', 
                            marginBottom: '20px', 
                            paddingBottom: '10px', 
                            borderBottom: '2px solid #28a745',
                            fontSize: '1.5em'
                        }}>Verified Reports</h3>
                        {reports.filter(r => r.status === 'verified').map(r => (
                            <div key={r.id} className="p-4 border mb-2" style={{
                                border: "1px solid #28a745",
                                padding: "20px",
                                margin: "10px 0",
                                borderRadius: "8px",
                                backgroundColor: "#d4edda",
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 8px 0', color: '#155724' }}>{r.location}</h4>
                                        <p style={{ margin: '8px 0', color: '#155724', lineHeight: '1.5' }}>{r.description}</p>
                                        <small style={{ color: '#155724' }}>Status: {r.status}</small>
                                    </div>
                                    <span style={{ 
                                        backgroundColor: '#28a745', 
                                        color: 'white', 
                                        padding: '4px 10px', 
                                        borderRadius: '12px', 
                                        fontSize: '0.8em',
                                        fontWeight: 'bold'
                                    }}>
                                        Verified
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ 
                            color: '#333', 
                            marginBottom: '20px', 
                            paddingBottom: '10px', 
                            borderBottom: '2px solid #dc3545',
                            fontSize: '1.5em'
                        }}>Rejected Reports</h3>
                        {reports.filter(r => r.status === 'rejected').map(r => (
                            <div key={r.id} className="p-4 border mb-2" style={{
                                border: "1px solid #dc3545",
                                padding: "20px",
                                margin: "10px 0",
                                borderRadius: "8px",
                                backgroundColor: "#f8d7da",
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 8px 0', color: '#721c24' }}>{r.location}</h4>
                                        <p style={{ margin: '8px 0', color: '#721c24', lineHeight: '1.5' }}>{r.description}</p>
                                        <small style={{ color: '#721c24' }}>Status: {r.status}</small>
                                    </div>
                                    <span style={{ 
                                        backgroundColor: '#dc3545', 
                                        color: 'white', 
                                        padding: '4px 10px', 
                                        borderRadius: '12px', 
                                        fontSize: '0.8em',
                                        fontWeight: 'bold'
                                    }}>
                                        Rejected
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorityReview;