import { useState, useEffect } from "react";
import Navbar from "@components/Navbar";
import "./AdminLogs.css";
import { getAllLogs } from "@api/logs";
import { Log } from "@Types/Log";
import { getAllUsers } from "@api/users";



function AdminLogs() {

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  // Fetch logs from api
  const [logs, setLogs] = useState<Log[]>([]);
  const [users, setUsers] = useState<{ userBadge: string }[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllLogs();
        setLogs(response.data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    }
    async function fetchUsers() {
      try {
        const response = await getAllUsers();
        //Add each userBadge to users
        const userBadges = response.data.map((user) => ({
          userBadge: user.badgeId,
        }));
        setUsers(userBadges);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchData();
    fetchUsers();
  }, []);


  const filteredLogs = logs.filter(log => 
    (!selectedUser || log.userBadge === selectedUser) &&
    (!selectedFilter || log.action === selectedFilter)
  );

  return (
    <div className="admin-container">
      <Navbar />

      <h2>Session & Log Management</h2>

      <div className="filters">
        <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
          <option value="">Filter by User</option>
          {users.map((user) => (
            <option key={user.userBadge} value={user.userBadge}>
              {user.userBadge}
            </option>
          ))}
        </select>

        <select onChange={(e) => setSelectedFilter(e.target.value)} value={selectedFilter}>
          <option value="">Filter by Type</option>
          <option value="Select_Suspect">Select Suspect</option>
          <option value="Access_logs">Access Logs</option>
          <option value="Start_detection">Analysis</option>
          <option value="Upload_video">Video Upload</option>
          <option value="Login">Login</option>
          <option value="Logout">Logout</option>
        </select>
      </div>

      <div className="log-container">
        <table className="log-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{users.find((u) => u.userBadge === log.userBadge)?.userBadge || "Unknown"}</td>
                <td>{log.action.replace("_", " ")}</td>
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
