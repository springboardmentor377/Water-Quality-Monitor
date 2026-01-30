import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();

  const login = async () => {
    await axios.post("http://127.0.0.1:8000/login", null,{
      params:{username,password}
    });
    navigate("/home");
  };

  return (
    <div>
      <h2>Water Quality Monitor</h2>
      <input placeholder="Username" onChange={e=>setUsername(e.target.value)}/>
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)}/>
      <button onClick={login}>Login</button>
    </div>
  );
}