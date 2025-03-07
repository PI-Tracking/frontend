import "./styles/Navbar.css";
import { UserCircle } from "lucide-react";
import logo from "../assets/logo.png";


// Maybe instead of doing this I should be doing for a decided input or a way for it ot add the parameters when I want and not predefined

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
          <li><a href="#">Manage</a></li>
          <li><a href="#">Cameras</a></li>
          <li><a href="#">ADMIN</a></li>
        </ul>
      </nav>
    );
  };
  
  export default Navbar;
