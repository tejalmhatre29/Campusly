import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "./Navbar";
import "./Resources.css";

function Resources({ onNavigate }) {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
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
            const response = await API.get('resources/');
            setResources(response.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
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

      await API.post('resources/', data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
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

      const response = await API.get('resources/');
setResources(response.data);
    } catch (error) {
    console.error('Upload error:', error);
    console.log('Server response:', error.response?.data);
    alert(JSON.stringify(error.response?.data));
}
  };

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
              <select
    name="category"
    onChange={handleChange}
    required
>
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

        {/* Resources */}
        <div className="resource-grid">
          {loading ? (
    <div className="loading-resources">
        <div className="loader"></div>
        <p>Loading resources...</p>
    </div>
) : resources.length === 0 ? (
    <div className="empty-resources">
        <h3>No resources yet</h3>
        <p>Be the first student to upload a resource!</p>
    </div>
) : (
            resources.map((resource) => (
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Resources;
