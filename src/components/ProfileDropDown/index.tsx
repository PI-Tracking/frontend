import { Link, useNavigate } from "react-router-dom";
import "./ProfileDropdown.css";
import { useAuth } from "@hooks/useAuth";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    auth.logout();
    onClose();
    navigate("");
    auth.isAuthenticated = !auth.isAuthenticated;
  };

  const handleLogin = () => {
    navigate("/login");
    auth.isAuthenticated = !auth.isAuthenticated;
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="profile-dropdown">
        <ul>
          <li>
            <Link to="/login" onClick={handleLogin}>
              Login
            </Link>
          </li>
        </ul>
      </div>
    );
  }
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
          <Link to="/" onClick={handleLogout}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ProfileDropdown;
