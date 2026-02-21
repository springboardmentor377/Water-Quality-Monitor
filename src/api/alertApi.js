import axios from './axiosInstance';
import { API_BASE } from '../utils/constants';

const useMock = () => (API_BASE.includes('example.com') || process.env.REACT_APP_USE_MOCK === 'true');

export const fetchAlerts = async () => {
	if (useMock()){
		// sample alerts for local development
		return [
			{ id: 1, type: 'Boil Advisory', severity: 'High', location: 'Riverbank', message: 'High turbidity detected. Boil water before drinking.', date: '2026-02-19' },
			{ id: 2, type: 'Contamination', severity: 'Critical', location: 'Harbor', message: 'Chemical contamination detected. Avoid all contact.', date: '2026-02-18' },
			{ id: 3, type: 'Low Dissolved Oxygen', severity: 'Medium', location: 'Upper Stream', message: 'Dissolved oxygen below safe threshold for fish.', date: '2026-02-17' },
			{ id: 4, type: 'Algae Bloom', severity: 'High', location: 'Lakeview', message: 'Algae bloom detected. Swimming advisory in effect.', date: '2026-02-16' },
			{ id: 5, type: 'Sensor Offline', severity: 'Low', location: 'East Bank', message: 'Sensor has been offline for 12 hours.', date: '2026-02-15' }
		];
	}
	const res = await axios.get('/alerts');
	return res.data;
};

export const createAlert = async (payload) => {
	if (useMock()){
		return { id: Date.now(), ...payload };
	}
	const res = await axios.post('/alerts', payload);
	return res.data;
};
