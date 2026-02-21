import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/login", null, {
        params: {
          email,
          password,
        },
      });

      // Save token
      localStorage.setItem("token", res.data.access_token);

      alert("Login successful!");
      navigate("/dashboard");

    } catch (err) {
      console.log("LOGIN ERROR:", err);

      const msg =
        err?.response?.data?.detail ||
        "Invalid credentials";

      alert(msg);
    }
  };

  return (
    <div className="page">
      <form className="card" onSubmit={handleLogin}>
        <h2 className="title">Login</h2>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn" type="submit">
          Login
        </button>

        <div className="helper">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;