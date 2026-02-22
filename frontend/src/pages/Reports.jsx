
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [waterSource, setWaterSource] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports/');
      setReports(res.data);
    } catch (err) {
      setError('Failed to fetch reports');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('location', location);
    formData.append('description', description);
    formData.append('water_source', waterSource);
    if (photo) formData.append('photo', photo);
    try {
      await api.post('/reports/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Report submitted!');
      setLocation('');
      setDescription('');
      setWaterSource('');
      setPhoto(null);
      fetchReports();
    } catch (err) {
      setError('Failed to submit report');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">User Reports</h2>
      <form className="mb-6 space-y-2" onSubmit={handleSubmit}>
        <input
          className="border p-2 rounded w-full"
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded w-full"
          type="text"
          placeholder="Water Source"
          value={waterSource}
          onChange={e => setWaterSource(e.target.value)}
          required
        />
        <textarea
          className="border p-2 rounded w-full"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded w-full"
          type="file"
          accept="image/*"
          onChange={e => setPhoto(e.target.files[0])}
        />
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button className="bg-blue-600 text-white p-2 rounded w-full" type="submit">Submit Report</button>
      </form>
      <div>
        <h3 className="font-semibold mb-2">Recent Reports</h3>
        <ul>
          {reports.map(r => (
            <li key={r.id} className="mb-2 border-b pb-2">
              <div><b>Location:</b> {r.location}</div>
              <div><b>Water Source:</b> {r.water_source}</div>
              <div><b>Description:</b> {r.description}</div>
              {r.photo_url && <img src={r.photo_url} alt="Report" className="w-32 mt-1" />}
              <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reports;
