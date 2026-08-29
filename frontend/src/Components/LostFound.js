import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "./Navbar";
import {
  Search,
  Plus,
  MapPin,
  Calendar,
  User,
  MessageCircle,
  CheckCircle,
  Trash2,
  X,
  Package,
  Image as ImageIcon,
} from "lucide-react";
import "./LostFound.css";

function LostFound({ onNavigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    item_type: "lost",
    category: "other",
    description: "",
    location: "",
    date: "",
    image: null,
  });

  const fetchItems = async () => {
    try {
      const response = await API.get("lostfound/");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching lost and found items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("item_type", formData.item_type);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("date", formData.date);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await API.post("lostfound/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post created successfully!");

      setFormData({
        name: "",
        item_type: "lost",
        category: "other",
        description: "",
        location: "",
        date: "",
        image: null,
      });

      setShowForm(false);

      fetchItems();
    } catch (error) {
      console.error("Create post error:", error);

      alert(JSON.stringify(error.response?.data || "Failed to create post."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`lostfound/${id}/`);

      setItems(items.filter((item) => item.id !== id));

      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Delete error:", error);

      alert(error.response?.data?.error || "Failed to delete post.");
    }
  };

  const handleResolve = async (id) => {
    try {
      const response = await API.patch(`lostfound/${id}/resolve/`);

      setItems(items.map((item) => (item.id === id ? response.data : item)));

      if (selectedItem?.id === id) {
        setSelectedItem(response.data);
      }
    } catch (error) {
      console.error("Resolve error:", error);

      alert(error.response?.data?.error || "Failed to mark item as resolved.");
    }
  };

  const openComments = async (item) => {
    setSelectedItem(item);
    setLoadingComments(true);

    try {
      const response = await API.get(`lostfound/${item.id}/comments/`);

      setComments(response.data);
    } catch (error) {
      console.error("Comment fetch error:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    try {
      const response = await API.post(
        `lostfound/${selectedItem.id}/comments/`,
        {
          comment: commentText.trim(),
        },
      );

      setComments((prevComments) => [...prevComments, response.data]);

      setCommentText("");

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                comment_count: (item.comment_count || 0) + 1,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("COMMENT ERROR:", error.response?.data || error.message);

      alert(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          JSON.stringify(error.response?.data) ||
          "Failed to add comment.",
      );
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await API.delete(`lostfound/comments/${commentId}/`);

      setComments(comments.filter((comment) => comment.id !== commentId));

      setItems(
        items.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                comment_count: Math.max(0, item.comment_count - 1),
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Delete comment error:", error);

      alert(error.response?.data?.error || "Failed to delete comment.");
    }
  };

  return (
    <div className="lostfound-page">
      <Navbar onNavigate={onNavigate} />

      <main className="lostfound-content">
        {/* Header */}

        <section className="lostfound-header">
          <div>
            <span className="section-label">CAMPUS COMMUNITY</span>

            <h1>Lost & Found</h1>

            <p>
              Help fellow students find their belongings or report something
              you've found.
            </p>
          </div>

          <button
            className="add-lostfound-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}

            {showForm ? "Close" : "Report Item"}
          </button>
        </section>

        {/* Add Form */}

        {showForm && (
          <section className="lostfound-form-card">
            <div className="form-heading">
              <div className="form-icon">
                <Package size={22} />
              </div>

              <div>
                <h2>Report a Lost or Found Item</h2>

                <p>
                  Provide accurate details so other students can identify the
                  item.
                </p>
              </div>
            </div>

            <form className="lostfound-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Item Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Black Wallet"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>

                  <select
                    name="item_type"
                    value={formData.item_type}
                    onChange={handleChange}
                  >
                    <option value="lost">Lost</option>

                    <option value="found">Found</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="electronics">Electronics</option>

                    <option value="documents">Documents</option>

                    <option value="accessories">Accessories</option>

                    <option value="books">Books</option>

                    <option value="clothing">Clothing</option>

                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Location</label>

                  <input
                    type="text"
                    name="location"
                    placeholder="Where was it lost/found?"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Item Image</label>

                  <div className="file-input-wrapper">
                    <ImageIcon size={18} />

                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  rows="4"
                  placeholder="Describe the item, color, identifying marks, etc."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-lostfound-btn"
                disabled={submitting}
              >
                {submitting ? "Posting..." : "Post Item"}
              </button>
            </form>
          </section>
        )}

        {/* Items */}

        <section className="lostfound-section">
          <div className="section-title">
            <div>
              <h2>Recent Reports</h2>

              <p>Latest lost and found reports from campus.</p>
            </div>
          </div>

          {loading ? (
            <div className="lostfound-loading">
              <div className="lostfound-loader"></div>

              <p>Loading reports...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="no-items">
              <Package size={42} />

              <h3>No reports yet</h3>

              <p>Be the first to report a lost or found item.</p>
            </div>
          ) : (
            <div className="lostfound-grid">
              {items.map((item) => (
                <article
                  className={`lostfound-card ${
                    item.item_type === "lost" ? "lost-card" : "found-card"
                  }`}
                  key={item.id}
                >
                  {item.image ? (
    <div
        className="item-image"
        onClick={() =>
            setSelectedImage(
                item.image.startsWith("http")
                    ? item.image
                    : `http://127.0.0.1:8000${item.image}`
            )
        }
    >
        <img
            src={
                item.image.startsWith("http")
                    ? item.image
                    : `http://127.0.0.1:8000${item.image}`
            }
            alt={item.name}
            onError={(e) => {
                console.error("Image failed to load:", e.target.src);
            }}
        />

        <div className="image-zoom-overlay">
            <ImageIcon size={20} />
            <span>View Image</span>
        </div>
    </div>
) : (
    <div className="item-image-placeholder">
        <Package size={42} />
    </div>
)}

                  <div className="item-card-content">
                    <div className="item-top">
                      <span className={`item-type ${item.item_type}`}>
                        {item.item_type === "lost" ? "Lost" : "Found"}
                      </span>

                      <span className="item-status">
                        {item.status === "resolved" && (
                          <CheckCircle size={14} />
                        )}

                        {item.status === "resolved" ? "Resolved" : "Active"}
                      </span>
                    </div>

                    <h3>{item.name}</h3>

                    <p className="item-description">{item.description}</p>

                    <div className="item-details">
                      <span>
                        <MapPin size={15} />
                        {item.location}
                      </span>

                      <span>
                        <Calendar size={15} />
                        {item.date}
                      </span>

                      <span>
                        <User size={15} />
                        {item.poster_name}
                      </span>
                    </div>

                    <div className="item-actions">
                      <button
                        className="comment-btn"
                        onClick={() => openComments(item)}
                      >
                        <MessageCircle size={16} />
                        Comments
                        <span>{item.comment_count}</span>
                      </button>

                      {item.status === "active" && (
                        <button
                          className="resolve-btn"
                          onClick={() => handleResolve(item.id)}
                        >
                          <CheckCircle size={16} />
                          Resolve
                        </button>
                      )}
                    </div>

                    <button
                      className="delete-item-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Comments Modal */}

      {selectedItem && (
        <div className="comments-overlay" onClick={() => setSelectedItem(null)}>
          <div className="comments-modal" onClick={(e) => e.stopPropagation()}>
            <div className="comments-header">
              <div>
                <span>COMMENTS</span>

                <h2>{selectedItem.name}</h2>
              </div>

              <button onClick={() => setSelectedItem(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="comments-list">
              {loadingComments ? (
                <div className="comments-loading">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="no-comments">
                  <MessageCircle size={32} />

                  <p>No comments yet.</p>

                  <span>Be the first to share information.</span>
                </div>
              ) : (
                comments.map((comment) => (
                  <div className="comment" key={comment.id}>
                    <div className="comment-avatar">
                      <User size={17} />
                    </div>

                    <div className="comment-body">
                      <div className="comment-meta">
                        <strong>{comment.commenter_name}</strong>

                        <span>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <p>{comment.comment}</p>

                      <button
                        className="delete-comment-btn"
                        onClick={() => deleteComment(comment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form className="comment-form" onSubmit={addComment}>
              <input
                type="text"
                placeholder="Share information about this item..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />

              <button type="submit">
                <MessageCircle size={17} />
                Comment
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedImage && (
    <div
        className="image-modal-overlay"
        onClick={() => setSelectedImage(null)}
    >
        <button
            className="image-modal-close"
            onClick={() => setSelectedImage(null)}
        >
            <X size={24} />
        </button>

        <img
            src={selectedImage}
            alt="Lost and found item"
            className="zoomed-item-image"
            onClick={(e) => e.stopPropagation()}
        />
    </div>
)}
    </div>
  );
}

export default LostFound;
