import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "./Navbar";
import "./Resources.css";
import { jwtDecode } from "jwt-decode";
import {
  BookOpen,
  FileText,
  BookMarked,
  ClipboardList,
  Folder,
  User,
  Phone,
  Bookmark,
  ThumbsUp,
  Trash2,
  Download,
  Plus,
  Search,
  Star,
} from "lucide-react";

function Resources({ onNavigate }) {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [likedResources, setLikedResources] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [ratingLoading, setRatingLoading] = useState(null);

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
        // Fetch resources
        const response = await API.get("resources/");
        setResources(response.data);

        // Fetch bookmarks
        const bookmarkResponse = await API.get("resources/bookmarks/");

        const bookmarkIds = bookmarkResponse.data.map(
          (bookmark) => bookmark.resource,
        );

        setBookmarkedResources(bookmarkIds);

        // Fetch likes
        const likeResponse = await API.get("resources/likes/");

        const likedIds = likeResponse.data.map((like) => like.resource);

        setLikedResources(likedIds);

        // Set like counts
        const counts = {};

        response.data.forEach((resource) => {
          counts[resource.id] = resource.like_count || 0;
        });

        setLikeCounts(counts);
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
      categoryFilter === "all" || resource.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const toggleBookmark = async (resourceId) => {
    const isBookmarked = bookmarkedResources.includes(resourceId);

    try {
      if (isBookmarked) {
        await API.delete(`resources/bookmark/${resourceId}/`);

        setBookmarkedResources(
          bookmarkedResources.filter((id) => id !== resourceId),
        );
      } else {
        await API.post("resources/bookmark/", {
          resource: resourceId,
        });

        setBookmarkedResources([...bookmarkedResources, resourceId]);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      alert("Failed to update bookmark.");
    }
  };

  const toggleLike = async (resourceId) => {
    const isLiked = likedResources.includes(resourceId);

    try {
      if (isLiked) {
        await API.delete(`resources/like/${resourceId}/`);

        setLikedResources(likedResources.filter((id) => id !== resourceId));

        setLikeCounts({
          ...likeCounts,
          [resourceId]: Math.max(0, (likeCounts[resourceId] || 0) - 1),
        });
      } else {
        await API.post("resources/like/", {
          resource: resourceId,
        });

        setLikedResources([...likedResources, resourceId]);

        setLikeCounts({
          ...likeCounts,
          [resourceId]: (likeCounts[resourceId] || 0) + 1,
        });
      }
    } catch (error) {
      console.error("Like error:", error);
      alert("Failed to update like.");
    }
  };

  const handleRating = async (resourceId, rating) => {
    try {
      setRatingLoading(resourceId);

      await API.post("resources/rate/", {
        resource: resourceId,
        rating: rating,
      });

      const response = await API.get("resources/");

      setResources(response.data);
    } catch (error) {
      console.error("Rating error:", error);
      alert("Failed to submit rating.");
    } finally {
      setRatingLoading(null);
    }
  };

  const handleDownload = async (resource) => {
  try {
    const response = await API.patch(
      `resources/${resource.id}/download/`
    );

    setResources(
      resources.map((item) =>
        item.id === resource.id
          ? {
              ...item,
              download_count: response.data.download_count,
            }
          : item
      )
    );

    window.location.href = resource.file;

  } catch (error) {
    console.error("Download error:", error);
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);

    alert("Failed to download resource.");
  }
};

  return (
    <div className="resources-page">
      <Navbar onNavigate={onNavigate} />

      <div className="resources-content">
        {/* Header */}
        <div className="resources-header">
          <div>
            <h1>
              <BookOpen size={32} />
              Campus Resources
            </h1>
            <p>
              Notes, PYQs, assignments and study material shared by students.
            </p>
          </div>

          <button
            className="add-resource-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} />
            Add Resource
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

        <div className="search-box">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search resources by title, subject or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="resource-filters">
          <button
            className={categoryFilter === "all" ? "active" : ""}
            onClick={() => setCategoryFilter("all")}
          >
            <Folder size={16} />
            All
          </button>

          <button
            className={categoryFilter === "notes" ? "active" : ""}
            onClick={() => setCategoryFilter("notes")}
          >
            <BookOpen size={16} />
            Notes
          </button>

          <button
            className={categoryFilter === "pyq" ? "active" : ""}
            onClick={() => setCategoryFilter("pyq")}
          >
            <FileText size={16} />
            PYQ
          </button>

          <button
            className={categoryFilter === "book" ? "active" : ""}
            onClick={() => setCategoryFilter("book")}
          >
            <BookMarked size={16} />
            Books
          </button>

          <button
            className={categoryFilter === "assignment" ? "active" : ""}
            onClick={() => setCategoryFilter("assignment")}
          >
            <ClipboardList size={16} />
            Assignments
          </button>

          <button
            className={categoryFilter === "other" ? "active" : ""}
            onClick={() => setCategoryFilter("other")}
          >
            <Folder size={16} />
            Other
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
                <p className="resource-contact">
                  <User size={15} />
                  {resource.uploader_name}
                </p>

                <p className="resource-contact">
                  <Phone size={15} />
                  {resource.uploader_phone}
                </p>

                <button
                  className="bookmark-btn"
                  onClick={() => toggleBookmark(resource.id)}
                >
                  <Bookmark
                    size={16}
                    fill={
                      bookmarkedResources.includes(resource.id)
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {bookmarkedResources.includes(resource.id) ? "Saved" : "Save"}
                </button>

                <div className="resource-stats">
                  <div className="rating-section">
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className="star-btn"
                          onClick={() => handleRating(resource.id, star)}
                          disabled={ratingLoading === resource.id}
                          title={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        >
                          <Star
                            size={18}
                            fill={
                              star <= Math.round(resource.average_rating || 0)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      ))}
                    </div>

                    <span className="rating-value">
                      {resource.average_rating || "0.0"}
                    </span>
                  </div>

                  <button
                    className="like-btn"
                    onClick={() => toggleLike(resource.id)}
                  >
                    <ThumbsUp
                      size={16}
                      fill={
                        likedResources.includes(resource.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                    <span>{likeCounts[resource.id] || 0}</span>
                  </button>

                  <span className="download-count">
                    <Download size={16} />
                    {resource.download_count || 0}
                  </span>
                </div>

                <button
                  className="download-btn"
                  onClick={() => handleDownload(resource)}
                >
                  <Download size={16} />
                  View / Download
                </button>

                {String(resource.uploaded_by_id) === String(currentUserId) && (
                  <button
                    className="delete-resource-btn"
                    onClick={() => handleDeleteResource(resource.id)}
                    disabled={deletingId === resource.id}
                  >
                    {deletingId === resource.id ? (
                      "Deleting..."
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete Resource
                      </>
                    )}
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
