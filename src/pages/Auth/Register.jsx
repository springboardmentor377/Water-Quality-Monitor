import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Register = ()=>{
  const [form,setForm]=useState({ name:'', email:'', password:'' }); const [loading,setLoading]=useState(false);
  const { register } = useAuth(); const navigate = useNavigate();
  const handleChange = (e)=> setForm(prev=> ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e)=>{ e.preventDefault(); setLoading(true); try{ await register(form); alert('Registered — proceed to login'); navigate('/login'); }catch(e){ alert('Registration failed'); } finally{ setLoading(false); } };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <label className="block mb-2">Name<input name="name" value={form.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded" required/></label>
        <label className="block mb-2">Email<input name="email" value={form.email} onChange={handleChange} className="w-full mt-1 p-2 border rounded" required/></label>
        <label className="block mb-4">Password<input type="password" name="password" value={form.password} onChange={handleChange} className="w-full mt-1 p-2 border rounded" required/></label>
        <button className="w-full bg-green-600 text-white py-2 rounded">{loading? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  );
};
export default Register;
