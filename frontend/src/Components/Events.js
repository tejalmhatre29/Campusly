import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";
import "./Events.css";

function Events({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    venue: "",
    event_date: "",
    registration_enabled: false,
    registration_link: "",
    registration_deadline: "",
    registration_details: "",
  });

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get("events/");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateEvent = async (e) => {
  e.preventDefault();

  try {
    const eventData = {
      ...formData,
      registration_deadline:
        formData.registration_deadline || null,
    };

    await API.post("events/", eventData);

    alert("Event created successfully!");

    setFormData({
      title: "",
      description: "",
      category: "",
      venue: "",
      event_date: "",
      registration_enabled: false,
      registration_link: "",
      registration_deadline: "",
      registration_details: "",
    });

    setShowForm(false);

    const response = await API.get("events/");
    setEvents(response.data);
  } catch (error) {
    console.error("Event creation error:", error);
    console.log("Backend response:", error.response?.data);
    alert("Failed to create event.");
  }
};

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(eventId);

      await API.delete(`events/${eventId}/`);

      setEvents(events.filter((event) => event.id !== eventId));

      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Delete event error:", error);
      alert("Failed to delete event.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="events-page">
      <Navbar onNavigate={onNavigate} />

      <div className="events-content">
        <div className="events-header">
          <div>
            <h1>📅 Campus Events</h1>
            <p>
              Discover workshops, fests, seminars and activities happening
              around campus.
            </p>
          </div>

          <button
            className="add-event-btn"
            onClick={() => setShowForm(!showForm)}
          >
            + Add Event
          </button>
        </div>

        {showForm && (
          <div className="event-form-card">
            <h2>Create an Event</h2>

            <form onSubmit={handleCreateEvent}>
              <input
                type="text"
                name="title"
                placeholder="Event title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <textarea
                name="description"
                placeholder="Event description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="academic">Academic</option>
                <option value="cultural">Cultural</option>
                <option value="technical">Technical</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>

              <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={formData.venue}
                onChange={handleChange}
                required
              />

              <input
                type="datetime-local"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                required
              />

              <div className="registration-section">
                <h3>Event Registration</h3>

                <label className="registration-toggle">
                  <input
                    type="checkbox"
                    name="registration_enabled"
                    checked={formData.registration_enabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registration_enabled: e.target.checked,
                      })
                    }
                  />
                  Enable registration for this event
                </label>

                {formData.registration_enabled && (
                  <div className="registration-fields">
                    <input
                      type="url"
                      name="registration_link"
                      placeholder="Registration link (Google Form, etc.)"
                      value={formData.registration_link}
                      onChange={handleChange}
                      required
                    />

                    <input
                      type="datetime-local"
                      name="registration_deadline"
                      value={formData.registration_deadline}
                      onChange={handleChange}
                    />

                    <textarea
                      name="registration_details"
                      placeholder="Additional registration details or instructions..."
                      rows="3"
                      value={formData.registration_details}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              <button type="submit">Create Event</button>
            </form>
          </div>
        )}

        <div className="events-grid">
          {loading ? (
            <div className="loading-events">
              <div className="loader"></div>
              <p>Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="empty-events">
              <h3>No events yet</h3>
              <p>Be the first to create a campus event!</p>
            </div>
          ) : (
            events.map((event) => (
              <div className="event-card" key={event.id}>
                <span className="event-category">{event.category}</span>

                <h3>{event.title}</h3>

                <p>{event.description}</p>

                <p>📍 {event.venue}</p>

                <p>📅 {new Date(event.event_date).toLocaleString()}</p>

                <p>👤 Organized by: {event.organizer_name}</p>

                {event.registration_enabled && (
    <div className="event-registration">

        <h4>Registration</h4>

        {event.registration_deadline && (
            <p>
                Deadline:{' '}
                {new Date(
                    event.registration_deadline
                ).toLocaleString()}
            </p>
        )}

        {event.registration_details && (
            <p>
                {event.registration_details}
            </p>
        )}

        <a
            href={event.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            className="register-event-btn"
        >
            Register Now
        </a>

    </div>
)}

                {String(event.organizer_id) === String(currentUserId) && (
                  <button
                    className="delete-event-btn"
                    onClick={() => handleDeleteEvent(event.id)}
                    disabled={deletingId === event.id}
                  >
                    {deletingId === event.id
                      ? "Deleting..."
                      : "🗑 Delete Event"}
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

export default Events;
