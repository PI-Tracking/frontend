import { useState, useEffect } from "react";
import Navbar from "@components/Navbar";
import "./Profile.css";
import { getUser } from "@api/users";
import { User } from "@Types/User";

function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [activeTime, setActiveTime] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUser("user-badge-id"); // Replace with actual badge ID
        if (response.status === 200) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <h2>{profile.username}</h2>
          </div>
          <div className="profile-info">
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{profile.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Role:</span>
              <span className="value">{profile.admin ? "Admin" : "User"}</span>
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
