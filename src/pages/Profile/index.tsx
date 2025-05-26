import Navbar from "@components/Navbar";
import "./Profile.css";
import { useAuth } from "@hooks/useAuth";

function ProfilePage() {
  const auth = useAuth();

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
