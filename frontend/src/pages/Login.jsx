import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Attempting login with:", { email, password }); // Debug log
      
      const res = await API.post("/auth/login", {
        email,
        password,
      });
      
      console.log("Login response:", res); // Debug log

      localStorage.setItem("token", res.data.access_token);
      console.log("Token stored in localStorage:", res.data.access_token); // Debug log
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error details:", error); // Detailed error log
      console.error("Error response:", error.response); // Error response details
      
      let errorMessage = "Invalid credentials";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Login failed: ${errorMessage}`);
    }
  };

  return (
    <div style={{ 
      padding: "40px", 
      maxWidth: "400px", 
      margin: "50px auto", 
      border: "1px solid #ddd", 
      borderRadius: "10px", 
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      backgroundColor: 'white'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: '0', fontSize: '1.8em' }}>Water Quality Monitor</h2>
        </div>
        <h3 style={{ margin: '0', color: '#333' }}>Sign in to your account</h3>
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            console.log("Email input changed to:", e.target.value); // Debug log
          }}
          style={{ 
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd", 
            borderRadius: "5px",
            fontSize: '16px',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            console.log("Password input changed"); // Debug log
          }}
          style={{ 
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd", 
            borderRadius: "5px",
            fontSize: '16px',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>

      <button 
        onClick={handleLogin}
        style={{ 
          width: "100%", 
          padding: "12px", 
          backgroundColor: "#667eea", 
          color: "white", 
          border: "none", 
          borderRadius: "5px", 
          cursor: "pointer",
          fontSize: '16px',
          fontWeight: '600',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6fd8'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
      >
        Sign In
      </button>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/register" style={{ color: "#667eea", textDecoration: "none", fontWeight: '500' }}>
          Don't have an account? Register here
        </Link>
      </div>
    </div>
  );
}

export default Login;