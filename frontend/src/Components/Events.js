import { useEffect, useState } from 'react';
import API from '../api';
import Navbar from './Navbar';
import './Events.css';

function Events({ onNavigate }) {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    venue: '',
    event_date: ''
});

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await API.get('events/');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
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

                    {events.length === 0 ? (
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

                                <p>
                                    📍 {event.venue}
                                </p>

                                <p>
                                    📅 {new Date(
                                        event.event_date
                                    ).toLocaleString()}
                                </p>

                                <p>
                                    👤 Organized by: {event.organizer_name}
                                </p>

                            </div>
                        ))
                    )}

                </div>

            </div>
        </div>
    );
}

export default Events;