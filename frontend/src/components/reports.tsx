import api from "../api";

export default ()=>{
 return <button onClick={()=>api.post("/report",{user_id:1,description:"test",water_source:"river",station_id:1})}>
 Submit Report
 </button>
}