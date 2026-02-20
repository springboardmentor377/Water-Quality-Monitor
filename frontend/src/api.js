import axios from "axios";

// Prefer Vite env variable `VITE_API_URL` (set in .env) and fall back to
// the current host with port 8000. This avoids hardcoding 127.0.0.1 and
// prevents mixed-origin issues when dev server runs on a different host/port.
const DEFAULT_API = `${window.location.protocol}//${window.location.hostname}:8000`;
const API_BASE = import.meta.env.VITE_API_URL || DEFAULT_API;

const API = axios.create({
  baseURL: API_BASE,
});

// Request interceptor to add token to requests
API.interceptors.request.use(
  (config) => {
    console.log("API Request:", config); // Debug log
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error); // Debug log
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized access
API.interceptors.response.use(
  (response) => {
    console.log("API Response:", response); // Debug log
    return response;
  },
  (error) => {
    console.error("API Response Error:", error); // Debug log
    console.error("Error Config:", error.config); // Debug log
    console.error("Error Response Data:", error.response?.data); // Debug log
    console.error("Error Response Status:", error.response?.status); // Debug log
    
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;