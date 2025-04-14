import "../AdminCameraPage.css";
import { Camera } from "@Types/Camera";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import * as Api from "@api/camera";
import CameraDTO from "@Types/CameraDTO";

interface IAddCameraForm {
  setIsFormVisible: Dispatch<SetStateAction<boolean>>;
  editingCamera: Camera;
}

export default function AddCameraForm({
  setIsFormVisible,
  editingCamera,
}: IAddCameraForm) {
  const [newCamera, setNewCamera] = useState<Camera>({
    ...editingCamera,
    name: editingCamera.name,
    latitude: editingCamera.latitude,
    longitude: editingCamera.longitude,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState({
    completed: false,
    sucess: false,
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!(newCamera.name && newCamera.latitude && newCamera.longitude)) {
      return;
    }

    const payloadCamera: Camera = {
      id: editingCamera.id ?? undefined,
      name: newCamera.name,
      latitude: newCamera.latitude,
      longitude: newCamera.longitude,
      active: editingCamera.active ?? undefined,
      addedAt: editingCamera.addedAt ?? undefined,
    };

    let response;
    try {
      if (newCamera.id !== undefined) {
        response = await Api.updateCamera(newCamera.id, payloadCamera);
      } else {
        response = await Api.addNewCamera(payloadCamera as CameraDTO);
      }
    } catch (error) {
      console.error("Error:");
      console.error(error);
    }

    setStatus({
      completed: true,
      sucess: response ? [200, 201].includes(response.status) : false,
    });
    setTimeout(() => {
      setStatus({ completed: false, sucess: false });
      setIsFormVisible(false);
    }, 2_500);

    setIsLoading(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewCamera({
      ...newCamera,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (isLoading) {
    return (
      <>
        <div className="camera-preview-area">
          <div className="preview-placeholder">
            <div className="loading-spinner"></div>
            <p>Attempting to add camera</p>
          </div>
        </div>
      </>
    );
  }

  if (status.completed) {
    return (
      <div className="camera-preview-area">
        {status.sucess ? (
          <div className="preview-placeholder">
            <p className="success-checkmark">&#10003;</p>
            <p>Camera successfully saved! :D</p>
          </div>
        ) : (
          <div className="preview-placeholder">
            <p className="success-checkmark">&#10005;</p>
            <p>Failure saving Camera :(</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <button
            className="modal-close-btn"
            onClick={() => setIsFormVisible(false)}
          >
            &times;
          </button>
          <div className="add-camera-form">
            <h2>{editingCamera ? "Edit Camera" : "Add Camera"}</h2>

            <div className="form-group">
              <label>Camera name</label>
              <input
                type="text"
                name="name"
                placeholder="Camera Name"
                value={newCamera.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Camera Latitude</label>
              <input
                type="text"
                name="latitude"
                placeholder="Camera Latitude"
                value={newCamera.latitude}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <input
                name="longitude"
                placeholder="Camera Longitude"
                value={newCamera.longitude}
                onChange={handleInputChange}
              />
            </div>

            <button className="submit-btn" onClick={handleSubmit}>
              {editingCamera ? "Save Changes" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
