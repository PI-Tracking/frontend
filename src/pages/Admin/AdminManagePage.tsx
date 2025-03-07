import Navbar from "@components/Navbar2.tsx";
import { useState } from "react";
import { UserCircle } from "lucide-react";
import "./AdminManagePage.css";


// They should have a different ID and also I should make it so the enabled stays saved
const initialUsers = [
  { id: 1, email: "1234@asfjuiahsf.cc", enabled: true },
  { id: 2, email: "dfskdjhfosdj@fdoighujofsigs.pt", enabled: false },
  { id: 3, email: "johnmcnugget@nein.s", enabled: true },
  
];

function AdminManagePage() {
  const [users, setUsers] = useState(initialUsers);

  const toggleUserStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, enabled: !user.enabled } : user
    ));
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
    </div>
  );
}

export default AdminManagePage;