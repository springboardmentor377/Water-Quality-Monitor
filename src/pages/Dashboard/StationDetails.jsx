import React, { useEffect, useState } from 'react';
import { fetchStationReadings } from '../../api/waterApi';

const StationDetails = ({ stationId }) => {
  const [readings, setReadings] = useState(null);
  useEffect(()=>{ const load = async ()=>{ const data = await fetchStationReadings(stationId); setReadings(data); }; if (stationId) load(); },[stationId]);
  if (!readings) return <div>Loading...</div>;
  return (<div className="bg-white p-4 rounded shadow"><h3 className="font-semibold">Station Readings</h3><ul className="text-sm space-y-1 mt-2"><li>pH: {readings.ph}</li><li>Turbidity: {readings.turbidity}</li><li>DO: {readings.do}</li></ul></div>);
};

export default StationDetails;
