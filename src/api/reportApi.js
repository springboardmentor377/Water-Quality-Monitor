import axios from './axiosInstance';
export const submitReport = async (formData) => { const res = await axios.post('/reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return res.data; };
export const listReports = async ()=> { const res = await axios.get('/reports'); return res.data; };
