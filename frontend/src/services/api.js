<<<<<<< HEAD
import axios from "axios";
import { logout } from "./auth";

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => {
    // Return successful response
    return response;
  },
  (error) => {
    // Handle errors globally
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error("Authentication failed - redirecting to login");
          logout();
          
          // Redirect to login page if not already there
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
          break;
          
        case 403:
          // Forbidden - insufficient permissions
          console.error("Access denied - insufficient permissions");
          alert("You don't have permission to perform this action");
          break;
          
        case 404:
          // Not found
          console.error("Resource not found");
          break;
          
        case 413:
          // File too large
          alert("File is too large. Maximum size is 5MB");
          break;
          
        case 500:
        case 502:
        case 503:
          // Server errors
          console.error("Server error - please try again later");
          alert("Server error. Please try again later.");
          break;
          
        default:
          console.error(`API Error ${status}:`, error.response.data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error - no response from server");
      alert("Network error. Please check your connection.");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
=======
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export default api;
>>>>>>> origin/main
