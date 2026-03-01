import axios from './axiosInstance';
import { API_BASE } from '../utils/constants';

// Helper to create a fake JWT (not secure, only for local mock use)
const makeFakeToken = (payload = {}) => {
	const base64url = (obj) => {
		const s = typeof obj === 'string' ? obj : JSON.stringify(obj);
		return btoa(s).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
	};
	const header = { alg: 'HS256', typ: 'JWT' };
	return `${base64url(header)}.${base64url(payload)}.signature`;
};

const useMock = () => (API_BASE.includes('example.com') || process.env.REACT_APP_USE_MOCK === 'true');

export const login = async (credentials) => {
	if (useMock()) {
		// Accept a sample credential for local development
		const { email, password } = credentials || {};
		if ((email === 'demo@demo.com' && password === 'password') || (email === 'admin@demo.com' && password === 'password')) {
			const user = { id: 1, email, username: email.split('@')[0] };
			return { access_token: makeFakeToken(user), user };
		}
		// otherwise return a failure-like response to mimic server
		throw new Error('Invalid credentials (mock)');
	}
	const res = await axios.post('/auth/login', credentials);
	return res.data;
};

export const register = async (payload) => {
	if (useMock()) {
		const user = { id: Date.now(), ...payload };
		return { user };
	}
	const res = await axios.post('/auth/register', payload);
	return res.data;
};

export const me = async () => {
	if (useMock()) {
		const token = localStorage.getItem('token');
		if (!token) throw new Error('Not authenticated (mock)');
		try {
			const parts = token.split('.');
			const payload = JSON.parse(atob(parts[1]));
			return { user: payload };
		} catch (e) {
			return { user: null };
		}
	}
	const res = await axios.get('/auth/me');
	return res.data;
};
