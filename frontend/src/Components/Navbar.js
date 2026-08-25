import './Navbar.css';

function Navbar({ onNavigate }) {
    return (
        <nav className="navbar">
            <div className="logo">Campusly 🎓</div>

            <div className="nav-links">
                <button className="nav-btn" onClick={() => onNavigate('home')}>
                    Home
                </button>

                <button className="nav-btn" onClick={() => onNavigate('resources')}>
                    Resources
                </button>

                <button className="nav-btn">
                    Events
                </button>

                <button className="nav-btn">
                    Lost & Found
                </button>

                <button className="nav-btn">
                    Profile
                </button>
            </div>
        </nav>
    );
}

export default Navbar;