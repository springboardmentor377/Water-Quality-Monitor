import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        email,
        password,
      });

      // Backend returns JWT token on successful login
      if (response.data?.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user_email", email);
        navigate("/dashboard");
      } else {
        alert("Login failed. Invalid server response.");
      }
    } catch (error: any) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      alert(
        "Login failed. Please check your email/password and make sure the backend is running."
      );
    }
  };

  return (
    <div className="login-wrapper">

      {/* HEADER */}
      <div className="login-header">
        <div className="logo">💧</div>
        <h1>Water Quality Monitor</h1>
        <p>Environmental Intelligence</p>
      </div>

      {/* CARD */}
      <div className="login-card">

        <h2>Login to Water Quality Monitor</h2>
        <span className="subtitle">
          Please enter your credentials to access the dashboard.
        </span>

        <div className="input-box">
          <span className="icon">📧</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div className="input-box">
          <span className="icon">🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <span 
            className="eye" 
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide password" : "Show password"}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <p 
          className="forgot" 
          onClick={() => alert("Please contact your administrator to reset your password.")}
          style={{ cursor: "pointer" }}
        >
          Forgot password?
        </p>

      </div>

      {/* FOOTER */}
      <div className="login-footer">
        © Water Quality Monitor. All rights reserved.
      </div>

    </div>
  );
}
