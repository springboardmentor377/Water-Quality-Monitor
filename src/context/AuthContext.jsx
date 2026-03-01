import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import * as authApi from '../api/authApi';

export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(()=>{ const raw = localStorage.getItem('user'); return raw? JSON.parse(raw): null; });
  useEffect(()=>{ const token = localStorage.getItem('token'); if (token && !user) { try{ const decoded = jwtDecode(token); setUser(decoded); localStorage.setItem('user', JSON.stringify(decoded)); }catch(e){ } } },[]);
  const login = async (credentials)=>{ const data = await authApi.login(credentials); const token = data.access_token || data.token; if (token) localStorage.setItem('token', token); const decoded = data.user || (token? jwtDecode(token): null); setUser(decoded); localStorage.setItem('user', JSON.stringify(decoded)); return decoded; };
  const register = async (payload)=> await authApi.register(payload);
  const logout = ()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout, register }}>{children}</AuthContext.Provider>;
};
