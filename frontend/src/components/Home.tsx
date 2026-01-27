import { useNavigate } from "react-router-dom";

export default function Home(){
  const nav = useNavigate();

  return(
    <div>
      <h1>Water Quality Monitoring System</h1>

      <button onClick={()=>nav("/map")}>Open Map</button>
      <button onClick={()=>nav("/report")}>Write Report</button>
    </div>
  )
}