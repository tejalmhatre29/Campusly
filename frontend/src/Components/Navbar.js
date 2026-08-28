import "./Navbar.css";
import { PackageSearch } from 'lucide-react';

function Navbar({ onNavigate }) {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="logo">Campusly 🎓</div>

      <div className="nav-links">
        <button className="nav-btn" onClick={() => onNavigate("home")}>
          Home
        </button>

        <button className="nav-btn" onClick={() => onNavigate("resources")}>
          Resources
        </button>

        <button className="nav-btn" onClick={() => onNavigate("events")}>
          Events
        </button>

        <button className="nav-btn" onClick={() => onNavigate("lostfound")}>
          <PackageSearch size={18} />
          Lost & Found
        </button>

        <button className="nav-btn">Profile</button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
