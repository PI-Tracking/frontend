import { Link } from "react-router-dom"; 
import { UserCircle } from "lucide-react";
import "./Navbar.css";
import logo from "@assets/logo.png";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-container">
        <div className="navbar-logo1">Tracking</div>
        <img src={logo} alt="Logo" className="navbar-logo-image" />
      </Link>
      <ul className="navbar-menu">
        <li><Link to="/">Home</Link></li> 
        <li><a href="https://github.com/PI-Tracking" target="_blank" rel="noopener noreferrer">About</a></li> 
        <li><a href="https://pi-tracking.github.io/microsite/" target="_blank" rel="noopener noreferrer">Contact</a></li> 
        <li><Link to="/cameras">Cameras</Link></li> 
      </ul>

      <UserCircle className="navbar-profile" />
    </nav>
  );
}

export default Navbar;
