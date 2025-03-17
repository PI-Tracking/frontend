import Navbar from "@components/Navbar2";
import { useState } from "react";
import "./AdminCameraPage.css";
import Camera from "@Types/Camera";
import CamerasList from "./components/CamerasList";
import AddCameraForm from "./components/AddCamera";

function AdminCameraPage() {
  /* Add/Edit camera logic*/
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingCamera, setEditingCamera] = useState<Camera>({} as Camera);

  return (
    <div className="admin-manage-container">
      <Navbar />

      <CamerasList setEditingCamera={setEditingCamera} />

      {isFormVisible && (
        <AddCameraForm
          editingCamera={editingCamera}
          setIsFormVisible={setIsFormVisible}
        />
      )}

      <div className="camera-controls">
        <button
          className="add-camera-btn"
          onClick={() => {
            setEditingCamera({} as Camera);
            setIsFormVisible(true);
          }}
        >
          Add Camera
        </button>
      </div>
    </div>
  );
}

export default AdminCameraPage;
