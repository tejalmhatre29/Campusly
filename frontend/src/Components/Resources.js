import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";
import "./Resources.css";

function Resources({ onNavigate }) {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const token = localStorage.getItem("access_token");

  let currentUserId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      currentUserId = decodedToken.user_id;
    } catch (error) {
      console.error("Invalid token");
    }
  }
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    category: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await API.get("resources/");
        setResources(response.data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      // const token = localStorage.getItem("access_token");

      const data = new FormData();

      data.append("title", formData.title);
      data.append("subject", formData.subject);
      data.append("category", formData.category);
      data.append("description", formData.description);

      if (formData.file) {
        data.append("file", formData.file);
      }

      await API.post("resources/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resource uploaded successfully!");

      setShowForm(false);

      setFormData({
        title: "",
        subject: "",
        category: "",
        description: "",
        file: null,
      });

      const response = await API.get("resources/");
      setResources(response.data);
    } catch (error) {
      console.error("Upload error:", error);
      console.log("Server response:", error.response?.data);
      alert(JSON.stringify(error.response?.data));
    }
  };

  const handleDeleteResource = async (resourceId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(resourceId);

      await API.delete(`resources/${resourceId}/`);

      setResources(resources.filter((resource) => resource.id !== resourceId));

      alert("Resource deleted successfully!");
    } catch (error) {
      console.error("Delete resource error:", error);
      alert("Failed to delete resource.");
    } finally {
      setDeletingId(null);
    }
  };

const filteredResources = resources.filter((resource) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
        resource.title.toLowerCase().includes(search) ||
        resource.subject.toLowerCase().includes(search) ||
        resource.description.toLowerCase().includes(search);

    const matchesCategory =
        categoryFilter === "all" ||
        resource.category === categoryFilter;

    return matchesSearch && matchesCategory;
});

  return (
    <div className="resources-page">
      <Navbar onNavigate={onNavigate} />

      <div className="resources-content">
        {/* Header */}
        <div className="resources-header">
          <div>
            <h1>📚 Campus Resources</h1>
            <p>
              Notes, PYQs, assignments and study material shared by students.
            </p>
          </div>

          <button
            className="add-resource-btn"
            onClick={() => setShowForm(!showForm)}
          >
            + Add Resource
          </button>
        </div>

        {/* Add Resource Form */}
        {showForm && (
          <div className="resource-form-card">
            <h2>Share a Resource</h2>

            <form onSubmit={handleUpload}>
              <input
                type="text"
                name="title"
                placeholder="Resource title"
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                onChange={handleChange}
                required
              />
              <select name="category" onChange={handleChange} required>
                <option value="">Select category</option>
                <option value="notes">Notes</option>
                <option value="pyq">Previous Year Questions</option>
                <option value="book">Books</option>
                <option value="assignment">Assignments</option>
                <option value="other">Other</option>
              </select>

              <textarea
                name="description"
                placeholder="Describe your resource..."
                rows="4"
                onChange={handleChange}
              />

              <input type="file" name="file" onChange={handleChange} />
              <button type="submit">Upload Resource</button>
            </form>
          </div>
        )}

        <div className="resource-search">
    <input
        type="text"
        placeholder="🔍 Search resources by title, subject or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
</div>

<div className="resource-filters">
    <button
        className={categoryFilter === "all" ? "active" : ""}
        onClick={() => setCategoryFilter("all")}
    >
        All
    </button>

    <button
        className={categoryFilter === "notes" ? "active" : ""}
        onClick={() => setCategoryFilter("notes")}
    >
        📚 Notes
    </button>

    <button
        className={categoryFilter === "pyq" ? "active" : ""}
        onClick={() => setCategoryFilter("pyq")}
    >
        📄 PYQ
    </button>

    <button
        className={categoryFilter === "book" ? "active" : ""}
        onClick={() => setCategoryFilter("book")}
    >
        📖 Books
    </button>

    <button
        className={categoryFilter === "assignment" ? "active" : ""}
        onClick={() => setCategoryFilter("assignment")}
    >
        📝 Assignments
    </button>

    <button
        className={categoryFilter === "other" ? "active" : ""}
        onClick={() => setCategoryFilter("other")}
    >
        📁 Other
    </button>
</div>

        {/* Resources */}
        <div className="resource-grid">
          {loading ? (
            <div className="loading-resources">
              <div className="loader"></div>
              <p>Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="empty-resources">
              <h3>No resources yet</h3>
              <p>Be the first student to upload a resource!</p>
            </div>
          ) : (
            filteredResources.map((resource) => (
              <div className="resource-card" key={resource.id}>
                <span className="resource-category">{resource.category}</span>

                <h3>{resource.title}</h3>

                <p>{resource.description}</p>

                <p className="resource-subject">Subject: {resource.subject}</p>

                <p className="resource-uploader">
                  Uploaded by: {resource.uploaded_by}
                </p>
                <p className="resource-contact">👤 {resource.uploader_name}</p>

                <p className="resource-contact">📞 {resource.uploader_phone}</p>

                <a
                  href={`http://127.0.0.1:8000${resource.file}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View / Download
                </a>

                {String(resource.uploaded_by_id) === String(currentUserId) && (
    <button
        className="delete-resource-btn"
        onClick={() => handleDeleteResource(resource.id)}
        disabled={deletingId === resource.id}
    >
        {deletingId === resource.id
            ? "Deleting..."
            : "🗑 Delete Resource"}
    </button>
)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Resources;
