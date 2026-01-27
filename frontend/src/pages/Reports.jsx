import { useEffect, useState } from "react";
import api from "../services/api";

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(()=>{
    api.get("/reports").then(res=>setReports(res.data));
  },[]);

  return reports.map(r=>(
    <div key={r.id}>
      <p>{r.description}</p>
      <p>{r.status}</p>
    </div>
  ));
}
