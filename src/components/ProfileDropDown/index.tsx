import { Link } from "react-router-dom";
import "./ProfileDropdown.css";

function ProfileDropdown({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="profile-dropdown">
      <ul>
        <li>
          <Link to="/profile" onClick={onClose}>
            Profile
          </Link>
        </li>
        <li>
          <Link to="/settings" onClick={onClose}>
            Settings
          </Link>
        </li>
        <li>
          <Link to="/logout" onClick={onClose}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ProfileDropdown;
