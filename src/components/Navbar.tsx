import "./styles/Navbar.css";
import { UserCircle } from "lucide-react";

function Navbar () {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Tracking</div>
      <ul className="navbar-menu">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
        <li><a href="#">Cameras</a></li>
      </ul>

      <UserCircle className="navbar-profile" />
    </nav>
  );
};

export default Navbar;
