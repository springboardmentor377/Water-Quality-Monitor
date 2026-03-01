import React, { useEffect, useState } from 'react';
import { listReports } from '../../api/reportApi';

const ReportList = ()=>{
  const [reports,setReports]=useState([]);
  useEffect(()=>{ const load=async()=>{ try{ const data = await listReports(); setReports(data||[]); }catch(e){ console.warn(e); } }; load(); },[]);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Submitted Reports</h2>
      <div className="space-y-3">
        {reports.length===0 && <div className="text-sm text-gray-500">No reports yet.</div>}
        {reports.map(r=> (<div key={r.id} className="bg-white p-4 rounded shadow flex justify-between"><div><div className="font-medium">{r.description}</div><div className="text-sm text-gray-600">{r.location} • {r.water_source}</div></div><div className="flex items-center"><span className={`px-2 py-1 rounded text-sm ${r.status==='open'? 'bg-yellow-100 text-yellow-800':'bg-green-100 text-green-800'}`}>{r.status}</span></div></div>))}
      </div>
    </div>
  );
};
export default ReportList;
