import "../AdminCameraPage.css";
import Camera from "@Types/Camera";
import { Dispatch, SetStateAction, useState } from "react";
import * as Api from "@api/camera";
import CameraDTO from "@Types/CameraDTO";

interface IAddCameraForm {
  setIsFormVisible: Dispatch<SetStateAction<boolean>>;
  isFormVisible: boolean;
  editingCamera: Camera;
}

export default function AddCameraForm({
  isFormVisible,
  setIsFormVisible,
  editingCamera,
}: IAddCameraForm) {
  const [newCamera, setNewCamera] = useState<Camera>(editingCamera);

  const handleSubmit = async () => {
    if (!(newCamera.name && newCamera.latitude && newCamera.longitude)) {
      return;
    }

    if (newCamera.id != "") {
      /* Updating a camera*/
      const updatedCamera: Camera = {
        ...editingCamera,
        ...newCamera,
      };

      try {
        Api.updateCamera(updatedCamera);
      } catch (error) {
        console.error(error);
      }
    } else {
      /* Adding new Camera */
      const payloadCamera: CameraDTO = {
        name: newCamera.name,
        latitude: newCamera.latitude,
        longitude: newCamera.longitude,
      };

      try {
        Api.addNewCamera(payloadCamera);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCamera({
      ...newCamera,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <>
      {isFormVisible && (
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
      )}
      {
        //  {(isAddingCamera || cameraAdded) && (
        //    <div className="camera-preview-area">
        //      {isAddingCamera ? (
        //        <div className="preview-placeholder">
        //          <div className="loading-spinner"></div>
        //          <p>Attempting to add camera</p>
        //        </div>
        //      ) : (
        //        <div className="preview-placeholder">
        //          <div className="success-checkmark">&#10003;</div>
        //          <p>Camera successfully added!</p>
        //        </div>
        //      )}
        //    </div>
        //  )}
      }
    </>
  );
}
