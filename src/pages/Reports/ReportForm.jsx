import React, { useState } from 'react';
import { submitReport } from '../../api/reportApi';

const ReportForm = ()=>{
  const [form,setForm]=useState({ description:'', location:'', water_source:'' }); const [image,setImage]=useState(null); const [loading,setLoading]=useState(false);
  const handleChange = (e)=> setForm(prev=> ({ ...prev, [e.target.name]: e.target.value }));
  const handleImage = (e)=> setImage(e.target.files[0]);
  const handleSubmit = async (e)=>{ e.preventDefault(); setLoading(true); try{ const fd = new FormData(); fd.append('description', form.description); fd.append('location', form.location); fd.append('water_source', form.water_source); if (image) fd.append('image', image); await submitReport(fd); alert('Report submitted'); setForm({ description:'', location:'', water_source:'' }); setImage(null); }catch(e){ alert('Submission failed'); } finally{ setLoading(false); } };
  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Submit Pollution Report</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">Description<textarea name="description" value={form.description} onChange={handleChange} className="w-full mt-1 p-2 border rounded" required /></label>
        <label className="block">Location<input name="location" value={form.location} onChange={handleChange} className="w-full mt-1 p-2 border rounded" required /></label>
        <label className="block">Water Source<input name="water_source" value={form.water_source} onChange={handleChange} className="w-full mt-1 p-2 border rounded" /></label>
        <label className="block">Image<input type="file" accept="image/*" onChange={handleImage} className="w-full mt-1" /></label>
        <button className="bg-blue-600 text-white py-2 px-4 rounded">{loading? 'Submitting...' : 'Submit Report'}</button>
      </form>
    </div>
  );
};
export default ReportForm;
