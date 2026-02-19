import { useState, useEffect } from "react";
import api from "../services/api";

export default function NGODashboard() {
  const [projects, setProjects] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCollabForm, setShowCollabForm] = useState(false);

  const [formData, setFormData] = useState({
    project_name: "",
    contact_email: "",
    description: "",
  });

  const [collabFormData, setCollabFormData] = useState({
    ngo_name: "",
    project_name: "",
    contact_email: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchCollaborations();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/ngo-projects");
      setProjects(response.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCollaborations = async () => {
    try {
      const response = await api.get("/collaborations");
      setCollaborations(response.data);
    } catch (err) {
      console.error("Failed to fetch collaborations", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCollabInputChange = (e) => {
    const { name, value } = e.target;
    setCollabFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/ngo-project", formData);
      setShowForm(false);
      setFormData({ project_name: "", contact_email: "", description: "" });
      fetchProjects(); // Refresh list
    } catch (err) {
      console.error("Failed to create project", err);
      setError("Failed to create project. Please try again.");
    }
  };

  const handleCollabSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/collaboration", collabFormData);
      setShowCollabForm(false);
      setCollabFormData({ ngo_name: "", project_name: "", contact_email: "" });
      fetchCollaborations(); // Refresh list
    } catch (err) {
      console.error("Failed to create collaboration", err);
      setError("Failed to create collaboration. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">
      {/* NGO Projects Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">NGO Projects</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {showForm ? "Cancel" : "Publish Project"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">Publish New Project</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Publish
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                No projects published yet.
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {project.project_name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{project.contact_email}</p>
                  <p className="text-gray-600 line-clamp-3">
                    {project.description || "No description provided."}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Collaborations Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Collaborations</h2>
          <button
            onClick={() => setShowCollabForm(!showCollabForm)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {showCollabForm ? "Cancel" : "Post Opportunity"}
          </button>
        </div>

        {showCollabForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">Post Collaboration Opportunity</h3>
            <form onSubmit={handleCollabSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NGO Name
                </label>
                <input
                  type="text"
                  name="ngo_name"
                  value={collabFormData.ngo_name}
                  onChange={handleCollabInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={collabFormData.project_name}
                  onChange={handleCollabInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={collabFormData.contact_email}
                  onChange={handleCollabInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Post Opportunity
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collaborations.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              No collaboration opportunities yet.
            </div>
          ) : (
            collaborations.map((collab) => (
              <div
                key={collab.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-teal-500"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {collab.project_name}
                </h3>
                <p className="text-sm font-semibold text-teal-600 mb-2">{collab.ngo_name}</p>
                <p className="text-sm text-gray-500 mb-4">{collab.contact_email}</p>
                <p className="text-xs text-gray-400">Posted on: {collab.created_at}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
