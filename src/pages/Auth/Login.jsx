import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = ()=>{
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [loading,setLoading]=useState(false);
  const { login } = useAuth(); const navigate = useNavigate();
  const handleSubmit = async (e)=>{ e.preventDefault(); setLoading(true); try{ await login({ email, password }); navigate('/dashboard'); }catch(e){ alert('Login failed'); } finally{ setLoading(false); } };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <label className="block mb-2">Email<input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded" required/></label>
        <label className="block mb-4">Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-1 p-2 border rounded" required/></label>
        <button className="w-full bg-blue-600 text-white py-2 rounded">{loading? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  );
};
export default Login;
