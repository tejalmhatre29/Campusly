import Navbar from './Navbar';
import './Home.css';

function Home() {
    return (
        <div className="home-page">
            <Navbar />

            <main className="home-content">
                <section className="hero-section">
                    <div>
                        <p className="welcome-text">WELCOME TO CAMPUSLY</p>

                        <h1>
                            Your Campus.
                            <br />
                            Your Community.
                        </h1>

                        <p className="hero-description">
                            Everything you need for college life in one place.
                            Find resources, discover events, and connect with
                            your campus community.
                        </p>

                        <button className="primary-btn">
                            Explore Resources
                        </button>
                    </div>

                    <div className="hero-card">
                        <span>🎓</span>
                        <h3>CampusConnect</h3>
                        <p>
                            Learn, share and connect with students across your
                            college.
                        </p>
                    </div>
                </section>

                <section className="features-section">
                    <h2>Explore Campusly</h2>

                    <div className="feature-grid">
                        <div className="feature-card">
                            <span>📚</span>
                            <h3>Resources</h3>
                            <p>
                                Access notes, PYQs, assignments and study
                                material.
                            </p>
                        </div>

                        <div className="feature-card">
                            <span>📅</span>
                            <h3>Events</h3>
                            <p>
                                Discover upcoming college events and activities.
                            </p>
                        </div>

                        <div className="feature-card">
                            <span>🔎</span>
                            <h3>Lost & Found</h3>
                            <p>
                                Report lost items or help others find their
                                belongings.
                            </p>
                        </div>

                        <div className="feature-card">
                            <span>🤝</span>
                            <h3>Community</h3>
                            <p>
                                Connect and collaborate with students on campus.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;