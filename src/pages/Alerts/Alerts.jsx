import React, { useEffect, useState } from 'react';
import { fetchAlerts, createAlert } from '../../api/alertApi';

const Alerts = ()=>{
  const [alerts,setAlerts]=useState([]);
  useEffect(()=>{ const load=async()=>{ try{ const data = await fetchAlerts(); setAlerts(data||[]); }catch(e){ setAlerts([{ id:1, type:'Boil Advisory', severity:'High', location:'Riverbank', message:'High turbidity detected. Boil water before drinking.' }]); } }; load(); },[]);

  const getSeverityColor = (severity) => {
    switch(severity){
      case 'Critical': return 'bg-red-50 border-l-4 border-red-500';
      case 'High': return 'bg-orange-50 border-l-4 border-orange-500';
      case 'Medium': return 'bg-yellow-50 border-l-4 border-yellow-500';
      case 'Low': return 'bg-green-50 border-l-4 border-green-500';
      default: return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  const getSeverityBadgeColor = (severity) => {
    switch(severity){
      case 'Critical': return 'bg-red-200 text-red-800';
      case 'High': return 'bg-orange-200 text-orange-800';
      case 'Medium': return 'bg-yellow-200 text-yellow-800';
      case 'Low': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const handleAddSample = async ()=>{
    const sample = { type:'New Advisory', severity:'Medium', location:'Sample Site', message:'This is a generated sample alert.', date: new Date().toISOString().slice(0,10) };
    try{
      const created = await createAlert(sample);
      setAlerts(prev=>[created, ...prev]);
    }catch(e){ setAlerts(prev=>[sample, ...prev]); }
  };
  return (
    <div className="p-6 bg-gradient-to-br from-water-light via-white to-blue-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Water Quality Alerts</h2>
      <div className="mb-6">
        <button onClick={handleAddSample} className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded hover:shadow-lg transition">+ Add Sample Alert</button>
      </div>
      <div className="space-y-4">
        {alerts.map(a=> (
          <div key={a.id} className={`p-4 rounded shadow ${getSeverityColor(a.severity)}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 flex items-center">
                  {a.type}
                  <span className={`text-xs ml-2 px-3 py-1 rounded-full font-semibold ${getSeverityBadgeColor(a.severity)}`}>
                    {a.severity}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">{a.location} • {a.date}</div>
              </div>
            </div>
            <div className="text-sm text-gray-800 mt-2">{a.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Alerts;
