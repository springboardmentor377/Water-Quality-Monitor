
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    api.get('/stations/').then(res => setStations(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Water Quality Map</h2>
      <div className="h-[500px] w-full">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {stations.map(station => (
            <Marker key={station.id} position={[station.latitude, station.longitude]}>
              <Popup>
                <b>{station.name}</b><br />
                {station.location}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
