import Navbar from "@components/Navbar";
import { useState, useEffect } from "react";
import "./AdminCameraPage.css";
import { Camera } from "@Types/Camera";
import AddCameraForm from "./components/AddCamera";
import { StatusCodes } from "http-status-codes";
import * as Api from "@api/camera";
import CameraList from "./components/CamerasList";
import { UUID } from "@Types/Base";

function AdminCameraPage() {
  /* Add/Edit camera logic*/
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingCamera, setEditingCamera] = useState<Camera>({} as Camera);
  const [cameraList, setCameras] = useState<Camera[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getAllCameras() {
      try {
        const { data: allCameras, status } = await Api.getAllCameras();

        console.log(allCameras);

        if (status == StatusCodes.OK && allCameras instanceof Array) {
          setCameras(allCameras);
        }
      } catch (error) {
        setError("Error fetching all cameras");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    getAllCameras();
  }, [isFormVisible]);

  const toggleCameraActive = async (id: UUID) => {
    await Api.toggleCamera(id);

    setCameras((prev) => {
      return prev.reduce((acc, curr) => {
        if (curr.id === id) {
          acc.push({ ...curr, active: !curr.active });
        } else acc.push(curr);
        return acc;
      }, [] as Camera[]);
    });
  };

  if (isLoading) {
    return (
      <div className="admin-table-container">
        <span>Loading...</span>;
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-table-container">
        <span>An error occured fetching all cameras: {error}</span>;
      </div>
    );
  }

  return (
    <div className="admin-manage-container">
      <Navbar />
      <div className="admin-table-container">
        <table className="admin-table">
          {cameraList.map((camera) => (
            <CameraList
              key={camera.id}
              camera={camera}
              setEditingCamera={setEditingCamera}
              toggleCameraActive={() => toggleCameraActive(camera.id)}
              openForm={() => setIsFormVisible(true)}
            />
          ))}
        </table>
      </div>

      {/* <CamerasList
        setEditingCamera={setEditingCamera}
        openForm={() => setIsFormVisible(true)}
      /> */}

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
