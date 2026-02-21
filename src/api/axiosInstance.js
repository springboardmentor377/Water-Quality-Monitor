import axios from 'axios';
import { API_BASE } from '../utils/constants';

const axiosInstance = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'application/json' } });

axiosInstance.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
