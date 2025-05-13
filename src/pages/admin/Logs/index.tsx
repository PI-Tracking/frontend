import { useState, useEffect } from "react";
import Navbar from "@components/Navbar";
import "./AdminLogs.css";

const initialUsers = [
  { id: 1, email: "user1@example.com" },
  { id: 2, email: "user2@example.com" },
  { id: 3, email: "user3@example.com" },
];

const initialLogs = [
  { id: 101, userId: 1, type: "live_follow", message: "Followed someone live", timestamp: "2025-03-18 14:30" },
  { id: 102, userId: 2, type: "video_follow", message: "Followed someone in a video", timestamp: "2025-03-18 14:35" },
  { id: 103, userId: 3, type: "video_upload", message: "Uploaded a video (ID: 3321)", timestamp: "2025-03-18 14:40" },
  { id: 104, userId: 1, type: "weapon_detection", message: "Weapon detected live (Camera: 5)", timestamp: "2025-03-18 14:50" },
  { id: 105, userId: 2, type: "session_start", message: "User logged in", timestamp: "2025-03-18 15:00" },
  { id: 106, userId: 3, type: "session_end", message: "User logged out", timestamp: "2025-03-18 15:10" },
  { id: 107, userId: 1, type: "camera_added", message: "Added a new camera (ID: 789)", timestamp: "2025-03-18 15:20" },
];

function AdminLogs() {
//   const [users, setUsers] = useState(initialUsers);
  const users = initialUsers
  const [logs, setLogs] = useState(initialLogs);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        userId: Math.floor(Math.random() * 3) + 1,
        type: "live_follow",
        message: "Followed someone live",
        timestamp: new Date().toLocaleTimeString(),
      };
      setLogs((prevLogs) => [newLog, ...prevLogs]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => 
    (!selectedUser || log.userId === Number(selectedUser)) &&
    (!selectedFilter || log.type === selectedFilter)
  );

  return (
    <div className="admin-container">
      <Navbar />

      <h2>Session & Log Management</h2>

      <div className="filters">
        <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
          <option value="">Filter by User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>

        <select onChange={(e) => setSelectedFilter(e.target.value)} value={selectedFilter}>
          <option value="">Filter by Type</option>
          <option value="live_follow">Followed (Live)</option>
          <option value="video_follow">Followed (Video)</option>
          <option value="video_upload">Uploaded Video</option>
          <option value="weapon_detection">Weapon Detection</option>
          <option value="session_start">User Logged In</option>
          <option value="session_end">User Logged Out</option>
          <option value="camera_added">Camera Added</option>
        </select>
      </div>

      <div className="log-container">
        <table className="log-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Message</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{users.find((u) => u.id === log.userId)?.email || "Unknown"}</td>
                <td>{log.type.replace("_", " ")}</td>
                <td>{log.message}</td>
                <td>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminLogs;
