import { useState } from "react";
import Navbar from "@components/Navbar";
import "./Profile.css";

interface UserProfile {
  username: string;
  email: string;
  role: string;
  lastLogin: string;
}

function ProfilePage() {
  const [profile] = useState<UserProfile>({
    username: "John Doe",
    email: "john.doe@example.com",
    role: "User",
    lastLogin: "2024-03-18 14:30",
  });

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
              <span className="value">{profile.role}</span>
            </div>
            <div className="info-item">
              <span className="label">Last Login:</span>
              <span className="value">{profile.lastLogin}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
