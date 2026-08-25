import { useEffect, useState } from 'react';
import API from '../api';
import Navbar from './Navbar';
import './Resources.css';

function Resources({ onNavigate }) {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const token = localStorage.getItem('access_token');

                const response = await API.get('resources/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setResources(response.data);
            } catch (error) {
                console.error('Error fetching resources:', error);
            }
        };

        fetchResources();
    }, []);

    return (
    <div className="resources-page">
        <Navbar onNavigate={onNavigate} />

        <div className="resources-content">
            <h1>📚 Campus Resources</h1>
            <p>
                Notes, PYQs, assignments and study material shared by students.
            </p>

            <div className="resource-grid">
                {resources.length === 0 ? (
                    <div className="empty-resources">
                        <h3>No resources yet</h3>
                        <p>Be the first student to upload a resource!</p>
                    </div>
                ) : (
                    resources.map((resource) => (
                        <div className="resource-card" key={resource.id}>
                            <span className="resource-category">
                                {resource.category}
                            </span>

                            <h3>{resource.title}</h3>
                            <p>{resource.description}</p>

                            <p className="resource-subject">
                                Subject: {resource.subject}
                            </p>

                            <p className="resource-uploader">
                                Uploaded by: {resource.uploaded_by}
                            </p>

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