import { useState, useEffect } from "react";
import Navbar from "@components/Navbar";
import "./Profile.css";
import { useAuth } from "@hooks/useAuth";

function ProfilePage() {
  const [activeTime, setActiveTime] = useState(0);
  const auth = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!auth.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {auth.user.username.charAt(0).toUpperCase()}
            </div>
            <h2>{auth.user.username}</h2>
          </div>
          <div className="profile-info">
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{auth.user.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Role:</span>
              <span className="value">
                {auth.user.admin ? "Admin" : "User"}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Active Time:</span>
              <span className="value">
                {Math.floor(activeTime / 60)} minutes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
