import Navbar from "@components/Navbar2";
import { useState } from "react";
import "./AdminManagePage.css";

const initialUsers = [
  { id: 1, email: "1234@asfjuiahsf.cc", enabled: true },
  { id: 2, email: "dfskdjhfosdj@fdoighujofsigs.pt", enabled: false },
  { id: 3, email: "johnmcnugget@nein.s", enabled: true },
];

function AdminManagePage() {
  const [users, setUsers] = useState(initialUsers);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", enabled: true });

  const toggleUserStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, enabled: !user.enabled } : user
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser({
      ...newUser,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddUser = () => {
    if (newUser.email) {
      setUsers([
        ...users,
        { id: Date.now(), email: newUser.email, enabled: newUser.enabled },
      ]);
      setNewUser({ email: "", enabled: true });
      setIsFormVisible(false);
    }
  };

  return (
    <div className="admin-manage-container">
      <Navbar />
      <div className="admin-table-container">
        <table className="admin-table">
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="admin-row">
                <td className="admin-user">
                  <div className="profile-icon">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  {user.email}
                </td>

                <td className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={user.enabled}
                    onChange={() => toggleUserStatus(user.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="add-user-btn"
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        {isFormVisible ? "Cancel" : "Add User"}
      </button>

      {isFormVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-btn"
              onClick={() => setIsFormVisible(false)}
            >
              &times;
            </button>
            <div className="add-user-form">
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
              {/*  Here it should generate a random passowrd */}
              <label>
                <input
                  type="checkbox"
                  name="enabled"
                  checked={newUser.enabled}
                  onChange={handleInputChange}
                />
                Enabled
              </label>
              <button onClick={handleAddUser}>Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManagePage;
