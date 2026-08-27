import React from "react";
import Navbar from "./Navbar";
import {
  BookOpen,
  CalendarDays,
  Search,
  Users,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import "./Home.css";

function Home({ onNavigate }) {
  return (
    <div className="home-page">
      <Navbar onNavigate={onNavigate} />

      <main className="home-content">

        {/* Hero Section */}
        <section className="hero-section">

          <div className="hero-background-shape shape-one"></div>
          <div className="hero-background-shape shape-two"></div>

          <div className="hero-left">

            <div className="welcome-badge">
              <Sparkles size={16} />
              <span>YOUR CAMPUS, CONNECTED</span>
            </div>

            <h1>
              Everything you need
              <span> for campus life.</span>
            </h1>

            <p className="hero-description">
              Discover academic resources, stay updated with campus events,
              and connect with students — all in one place.
            </p>

            <button
              className="primary-btn"
              onClick={() => onNavigate("resources")}
            >
              Explore Resources
              <ArrowRight size={18} />
            </button>

          </div>

          <div className="hero-right">

            <div className="hero-card">

              <div className="hero-card-icon">
                <GraduationCap size={34} />
              </div>

              <div className="hero-card-content">
                <span className="hero-card-label">
                  CAMPUSLY
                </span>

                <h3>
                  Learn.
                  <br />
                  Connect.
                  <br />
                  Grow.
                </h3>

                <p>
                  A smarter way to experience your college journey.
                </p>
              </div>

              <div className="hero-card-glow"></div>

            </div>

          </div>

        </section>


        {/* Features */}
        <section className="features-section">

          <div className="section-heading">
            <span>EXPLORE CAMPUSLY</span>
            <h2>Everything in one place.</h2>
          </div>

          <div className="feature-grid">

            <div
              className="feature-card"
              onClick={() => onNavigate("resources")}
            >
              <div className="feature-icon">
                <BookOpen size={24} />
              </div>

              <h3>Resources</h3>

              <p>
                Access notes, previous year questions, assignments,
                books and study material shared by students.
              </p>

              <div className="feature-arrow">
                <ArrowRight size={18} />
              </div>
            </div>


            <div
              className="feature-card"
              onClick={() => onNavigate("events")}
            >
              <div className="feature-icon">
                <CalendarDays size={24} />
              </div>

              <h3>Events</h3>

              <p>
                Discover upcoming college events, workshops,
                competitions and student activities.
              </p>

              <div className="feature-arrow">
                <ArrowRight size={18} />
              </div>
            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <Search size={24} />
              </div>

              <h3>Discover</h3>

              <p>
                Quickly find the resources and information
                you need across your campus.
              </p>

              <div className="feature-arrow">
                <ArrowRight size={18} />
              </div>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <Users size={24} />
              </div>

              <h3>Community</h3>

              <p>
                Share useful resources and connect with
                fellow students in your campus community.
              </p>

              <div className="feature-arrow">
                <ArrowRight size={18} />
              </div>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Home;