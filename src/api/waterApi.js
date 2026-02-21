import axios from './axiosInstance';
export const fetchStations = async ()=> { const res = await axios.get('/stations'); return res.data; };
export const fetchStationReadings = async (id)=> { const res = await axios.get(`/stations/${id}/readings`); return res.data; };
