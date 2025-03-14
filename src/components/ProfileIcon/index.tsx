import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";
import "./ProfileDropdown.css";

const ProfileDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const trigger = useRef<SVGSVGElement | null>(null);
  const dropdown = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current || !trigger.current) return;
      if (!(target instanceof Node)) return; // Necessary to "bypass" typescript type enforcement

      if (dropdown.current.contains(target) || trigger.current.contains(target))
        return;

      setIsDropdownOpen(false);
    };

    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, []);

  return (
    <div className="profile-dropdown-container">
      <UserCircle
        ref={trigger}
        className={`profile-icon ${isDropdownOpen ? "active" : ""}`}
        onClick={toggleDropdown}
      />
      {isDropdownOpen && (
        <div ref={dropdown} className="profile-dropdown-menu">
          <ul>
            <li>
              <Link to="/logout" onClick={() => console.log("Logging out...")}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
