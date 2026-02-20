import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapPanel({stations}){

return(

<MapContainer
center={[20.5937,78.9629]}
zoom={5}
style={{height:"500px"}}
>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

{
stations.map((s,i)=>(

<Marker key={i}
position={[s.latitude,s.longitude]}>

<Popup>

{s.name}

</Popup>

</Marker>

))
}

</MapContainer>

);

}
