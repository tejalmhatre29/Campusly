import { useEffect, useState } from 'react';
import API from '../api';
import Navbar from './Navbar';
import { jwtDecode } from "jwt-decode";
import './Events.css';

function Events({ onNavigate }) {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
const [deletingId, setDeletingId] = useState(null);
    const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    venue: '',
    event_date: ''
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
            const response = await API.get('events/');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
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
        [name]: value
    });
};

const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
        await API.post('events/', formData);

        alert('Event created successfully!');

        setFormData({
            title: '',
            description: '',
            category: '',
            venue: '',
            event_date: ''
        });

        setShowForm(false);

        const response = await API.get('events/');
        setEvents(response.data);

    } catch (error) {
        console.error('Event creation error:', error);
        console.log(error.response?.data);
        alert('Failed to create event.');
    }
};

const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm(
        'Are you sure you want to delete this event?'
    );

    if (!confirmDelete) {
        return;
    }

    try {
        setDeletingId(eventId);

        await API.delete(`events/${eventId}/`);

        setEvents(
            events.filter((event) => event.id !== eventId)
        );

        alert('Event deleted successfully!');
    } catch (error) {
        console.error('Delete event error:', error);
        alert('Failed to delete event.');
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
                            Discover workshops, fests, seminars and activities
                            happening around campus.
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

                            <button type="submit">
                                Create Event
                            </button>
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

                <span className="event-category">
                    {event.category}
                </span>

                <h3>{event.title}</h3>

                <p>{event.description}</p>

                <p>📍 {event.venue}</p>

                <p>
                    📅 {new Date(
                        event.event_date
                    ).toLocaleString()}
                </p>

                <p>
                    👤 Organized by: {event.organizer_name}
                </p>

                {String(event.organizer_id) === String(currentUserId) && (
                    <button
                        className="delete-event-btn"
                        onClick={() =>
                            handleDeleteEvent(event.id)
                        }
                        disabled={deletingId === event.id}
                    >
                        {deletingId === event.id
                            ? 'Deleting...'
                            : '🗑 Delete Event'}
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