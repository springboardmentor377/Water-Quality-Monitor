import { useEffect, useState } from "react";

function Collaboration() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    ngo_name: "",
    project_name: "",
    contact_email: ""
  });

  const fetchItems = async () => {
    const res = await fetch("http://localhost:8000/collaborations/");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:8000/collaborations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    setForm({
      ngo_name: "",
      project_name: "",
      contact_email: ""
    });

    fetchItems();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🤝 NGO Collaboration</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="NGO Name"
          value={form.ngo_name}
          onChange={(e) =>
            setForm({ ...form, ngo_name: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Project Name"
          value={form.project_name}
          onChange={(e) =>
            setForm({ ...form, project_name: e.target.value })
          }
          required
          style={{ marginLeft: "10px" }}
        />

        <input
          type="email"
          placeholder="Contact Email"
          value={form.contact_email}
          onChange={(e) =>
            setForm({ ...form, contact_email: e.target.value })
          }
          required
          style={{ marginLeft: "10px" }}
        />

        <button type="submit" style={{ marginLeft: "10px" }}>
          Add
        </button>
      </form>

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "6px"
          }}
        >
          <strong>{item.ngo_name}</strong> — {item.project_name}
          <p>Email: {item.contact_email}</p>
        </div>
      ))}
    </div>
  );
}

export default Collaboration;
