import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/register", null, {
        params: { name, email, password },
      });

      alert("Registered successfully! Now login.");
      navigate("/");
    } catch (err) {
  console.log("REGISTER ERROR:", err);

  const msg =
    err?.response?.data?.detail ||
    err?.response?.data?.message ||
    err?.message ||
    "Registration failed";

  alert(msg);
}

  };

  return (
    <div className="page">
      <form className="card" onSubmit={handleRegister}>
        <h2 className="title">Register</h2>
        <p className="subtitle">Water Quality Monitoring System • Module 1</p>

        <div className="field">
          <label className="label">Name</label>
          <input
            className="input"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn" type="submit">
          Create Account
        </button>

        <div className="helper">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
