import { useEffect, useState } from "react"
import axios from "axios"

export default function NGODashboard() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState({
    ngo_name: "",
    project_name: "",
    contact_email: ""
  })

  const fetchProjects = () => {
    axios.get("http://localhost:8000/collaborations")
      .then(res => setProjects(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post(
        "http://localhost:8000/collaborations",
        form
      )

      alert("Collaboration created successfully!")
      setForm({
        ngo_name: "",
        project_name: "",
        contact_email: ""
      })

      fetchProjects()
    } catch (error) {
      console.error(error)
      alert("Error creating collaboration")
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>NGO Dashboard</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          placeholder="NGO Name"
          value={form.ngo_name}
          onChange={e => setForm({ ...form, ngo_name: e.target.value })}
        />

        <input
          placeholder="Project Name"
          value={form.project_name}
          onChange={e => setForm({ ...form, project_name: e.target.value })}
        />

        <input
          placeholder="Contact Email"
          value={form.contact_email}
          onChange={e => setForm({ ...form, contact_email: e.target.value })}
        />

        <button type="submit">Create Collaboration</button>
      </form>

      <h3>Existing Projects</h3>

      {projects.length === 0 ? (
        <p>No collaborations yet</p>
      ) : (
        projects.map(project => (
          <div key={project.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <strong>{project.project_name}</strong>
            <p>NGO: {project.ngo_name}</p>
            <p>Email: {project.contact_email}</p>
          </div>
        ))
      )}
    </div>
  )
}