import {useState} from "react";
import axios from "axios";

export default function Report(){

 const [station_name,setStation]=useState("");
 const [location,setLocation]=useState("");
 const [water_source,setSource]=useState("");
 const [description,setDesc]=useState("");

 const submit=()=>{
   axios.post("http://127.0.0.1:8000/report",{
     station_name,location,water_source,description
   });
   alert("Report submitted");
 }

 return(
   <div>
     <input placeholder="Station Name" onChange={e=>setStation(e.target.value)}/>
     <input placeholder="Location" onChange={e=>setLocation(e.target.value)}/>
     <input placeholder="Water Source" onChange={e=>setSource(e.target.value)}/>
     <textarea placeholder="Description" onChange={e=>setDesc(e.target.value)}/>
     <button onClick={submit}>Submit</button>
   </div>
 )
}