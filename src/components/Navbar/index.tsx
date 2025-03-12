import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";
import "./navbar.css";
import logo from "@assets/logo.png";
import { useState } from "react";

function Navbar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);  

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(prevState => !prevState);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-container">
        <div className="navbar-logo1">Tracking</div>
        <img src={logo} alt="Logo" className="navbar-logo-image" />
      </Link>
      <ul className="navbar-menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <a
            href="https://github.com/PI-Tracking"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="https://pi-tracking.github.io/microsite/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </a>
        </li>
        <li>
          <Link to="/cameras">Cameras</Link>
        </li>
      </ul>

      <div className="navbar-profile-container">
        <UserCircle 
          className={`navbar-profile ${isProfileMenuOpen ? "active" : ""}`} 
          onClick={toggleProfileMenu} 
        />
        {isProfileMenuOpen && (
          <div className="navbar-profile-menu">
            <ul>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
              <li>
                <Link to="/logout">Logout</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
