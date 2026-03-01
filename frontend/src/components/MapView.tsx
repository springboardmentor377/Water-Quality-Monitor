import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";

export default function MapView() {
  const [stations, setStations] = useState<any[]>([]);

  const mapProps = {
    center: [17.385, 78.486],
    zoom: 6,
  } as any;

  const tileLayerProps = {
    attribution: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  } as any;

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/stations/")
      .then((res) => setStations(res.data));
  }, []);

  return (
    <MapContainer {...mapProps} style={{ height: "400px", width: "100%" }}>
      <TileLayer {...tileLayerProps} />

      {stations.map((station) => (
        <Marker
          key={station.id}
          position={[station.latitude, station.longitude]}
        >
          <Popup>
            <b>{station.name}</b>
            <br />
            {station.location}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
