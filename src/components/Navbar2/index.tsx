import { Link } from "react-router-dom";
import "./navbar.css";
//import { UserCircle } from "lucide-react";
import logo from "@assets/logo.png";

// This navbar is for admin

function Navbar() {
  return (
    <nav className="navbar">
      <style>
        {`
          .navbar {
              background-color: #0C0C0C;
              opacity: 0.67;
          }
          .navbar-logo {
            position: relative;
            display: flex;
            align-items: center;
            font-size: 24px;
            font-weight: bold;
          }
          .logo-image {
            width: 50px; 
            height: auto;
            margin-right: 16px;
          }
          .logo-text {
            position: relative;
            z-index: 1;
          }
        `}
      </style>
      <div className="navbar-logo">
        <img src={logo} alt="Logo" className="logo-image" />
        <span className="logo-text">Tracking</span>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/admin/logs">Logs</Link>
        </li>
        <li>
          <Link to="/admin/manage">Manage</Link>
        </li>
        <li>
          <Link to="/admin/cameras">Cameras</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
