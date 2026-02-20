import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen"); // Default to citizen

  const handleRegister = async () => {

    try {

      await API.post("/auth/register", {
        name,
        email,
        password,
        role
      });

      alert("Registered successfully! Please login to continue.");
      navigate("/");

    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed: " + (error.response?.data?.detail || "Unknown error"));
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
        <h3 style={{ margin: '0', color: '#333' }}>Create a new account</h3>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
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
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
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
          onChange={(e)=>setPassword(e.target.value)}
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
        <select
          value={role}
          onChange={(e)=>setRole(e.target.value)}
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
        >
          <option value="citizen">Citizen</option>
          <option value="ngo">NGO Representative</option>
          <option value="authority">Authority</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button 
        onClick={handleRegister}
        style={{ 
          width: "100%", 
          padding: "12px", 
          backgroundColor: "#28a745", 
          color: "white", 
          border: "none", 
          borderRadius: "5px", 
          cursor: "pointer",
          fontSize: '16px',
          fontWeight: '600',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
      >
        Create Account
      </button>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/" style={{ color: "#667eea", textDecoration: "none", fontWeight: '500' }}>
          Already have an account? Login here
        </Link>
      </div>
    </div>
  );
}

export default Register;