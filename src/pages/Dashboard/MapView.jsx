import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchStations, fetchStationReadings } from '../../api/waterApi';
import { MAP_TILE_URL } from '../../utils/constants';

const MapView = ()=>{
  const [stations,setStations]=useState([]);
  const [selected,setSelected]=useState(null);
  useEffect(()=>{ const load=async()=>{ try{ const data = await fetchStations(); setStations(data||[]); }catch(e){ setStations([{ id:1, name:'Demo Station', lat:6.9271, lng:79.8612 }]); } }; load(); },[]);
  const handleClick = async (st)=>{ setSelected({...st, loading:true}); try{ const r = await fetchStationReadings(st.id); setSelected({...st, readings:r}); }catch(e){ setSelected({...st, readings:null}); } };
  return (
    <div className="card card-full rounded overflow-hidden h-96">
      <MapContainer center={[6.9271,79.8612]} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={MAP_TILE_URL} />
        {stations.map(st=> (
          <Marker key={st.id} position={[st.lat, st.lng]} eventHandlers={{ click: ()=>handleClick(st) }}>
            <Popup>
              <div className="space-y-2"><div className="font-semibold">{st.name}</div>{selected && selected.id===st.id && selected.readings? (<div className="text-sm"><div>pH: {selected.readings.ph}</div></div>) : (<div className="text-sm">Click marker to load readings</div>)}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
