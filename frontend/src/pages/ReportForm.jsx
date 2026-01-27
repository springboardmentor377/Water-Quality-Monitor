import api from "../services/api";
import { useState } from "react";

export default function ReportForm() {
  const [form, setForm] = useState({});

  const submit = async () => {
    await api.post("/report", form);
    alert("Submitted");
  };

  return (
    <div>
      <input placeholder="Description" onChange={e=>setForm({...form,description:e.target.value})}/>
      <button onClick={submit}>Submit</button>
    </div>
  );
}
