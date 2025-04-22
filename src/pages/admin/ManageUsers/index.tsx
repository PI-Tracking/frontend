import Navbar from "@components/Navbar";
import { ChangeEvent, useState, useEffect } from "react";
import "./AdminManagePage.css";
import { getAllUsers, createNewAccount, toggleAccount } from "@api/users";
import { User } from "@Types/User";
import { CreateUserDTO, NewUserInfo } from "@Types/CreateUserDTO";

function AdminManagePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [credentials, setCredentials] = useState<NewUserInfo>({
    username: "",
    password: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isForm2Visible, setIsForm2Visible] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserDTO>({
    badgeId: "",
    email: "",
    username: "",
    admin: false,
  });
  const [toggleUsed, setToggleUsed] = useState(0);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.status == 200) {
          setUsers(response.data);
        }
      } catch {
        alert(" There was an unexpected error with the request.");
      }
    };
    fetchUsers();
  }, [setUsers, setCredentials, credentials, toggleUsed]);

  const toggleUserStatus = (id: string) => {
    setToggleUsed(toggleUsed + 1);
    toggleAccount(id);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      email: e.target.value,
    }));
  };
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      username: e.target.value,
    }));
  };
  const handleBadgeIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      badgeId: e.target.value,
    }));
  };
  const handleIsAdminChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      admin: e.target.checked,
    }));
  };

  const handleAddUser = async () => {
    if (newUser) {
      try {
        const response = await createNewAccount(newUser);
        if (response.status === 201) {
          setCredentials(response.data);
          setCreated(true);
        }
      } catch {
        alert("There was an unexpected error with the request.");
      }
      setIsFormVisible(false);
      setIsForm2Visible(true);
    }
  };

  return (
    <div className="admin-manage-container">
      <Navbar />
      <div className="admin-table-container">
        <table className="admin-table">
          <tbody>
            {users.map((user) => (
              <tr key={user.badgeId} className="admin-row">
                <td className="admin-user">
                  <span>{user.admin ? " [Admin]" : "[User]"}</span>

                  <div className="profile-icon">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  {user.email}
                </td>

                <td className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={user.enabled}
                    onChange={() => toggleUserStatus(user.badgeId)}
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
                type="text"
                name="badgeId"
                placeholder="Enter a badgeId"
                value={newUser?.badgeId}
                onChange={handleBadgeIdChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Enter an email"
                value={newUser?.email}
                onChange={handleEmailChange}
                required
              />
              <input
                type="text"
                name="name"
                placeholder="Enter a name"
                value={newUser?.username}
                onChange={handleUsernameChange}
                required
              />
              <div>
                <input
                  type="checkbox"
                  name="admin"
                  checked={newUser?.admin}
                  onChange={handleIsAdminChange}
                  required
                />
                <label>Is an Admin</label>
              </div>
              <button onClick={handleAddUser}>Add User</button>
            </div>
          </div>
        </div>
      )}
      {isForm2Visible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-btn"
              onClick={() => {
                setIsForm2Visible(false);
                setCreated(false);
              }}
            >
              &times;
            </button>
            {created ?  
            <div>
              <h3>User created with success.</h3>
              <h3>Credentials have been sent by email!</h3>
              {/* <h3>Username: {credentials?.username}</h3>
              <h3>Password: {credentials?.password}</h3> */}
            </div>
            :
            <div>
              <h3>An error occurred!</h3>
              <h3>User was not created!</h3>
            </div>
}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManagePage;
