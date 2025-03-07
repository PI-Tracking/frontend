import Navbar from "@components/Navbar2.tsx";
import { useState, useEffect } from "react";
import "./AdminCameraPage.css"; 

const initialCameras = [
  { id: 1, name: "Camera 1", description: "Camera description", code: "CAM001", enabled: true },
  { id: 2, name: "Camera 2", description: "Camera description", code: "CAM002", enabled: false },
  { id: 3, name: "Camera 3", description: "Camera description", code: "CAM003", enabled: true },
];

function AdminCameraPage() {
  const [cameras, setCameras] = useState(initialCameras);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAddingCamera, setIsAddingCamera] = useState(false);
  const [newCamera, setNewCamera] = useState({ 
    name: "", 
    description: "", 
    code: "", 
    enabled: true 
  });
  const [cameraAdded, setCameraAdded] = useState(false);


  // Here im working with timeouts but in reality it would just wait for the real camera to be added
  useEffect(() => {
    if (isAddingCamera) {
      setTimeout(() => {
        
        setCameraAdded(true);
        setIsAddingCamera(false);
      }, 5000); 
    }
  }, [isAddingCamera]);

  const toggleCameraStatus = (id) => {
    setCameras(cameras.map((camera) =>
      camera.id === id ? { ...camera, enabled: !camera.enabled } : camera
    ));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCamera({
      ...newCamera,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddCamera = () => {
    if (newCamera.name && newCamera.code) {
      setCameras([
        ...cameras,
        { 
          id: Date.now(), 
          name: newCamera.name, 
          description: newCamera.description,
          code: newCamera.code,
          enabled: newCamera.enabled 
        },
      ]);
      setNewCamera({ name: "", description: "", code: "", enabled: true });
      setIsFormVisible(false);
      setIsAddingCamera(true);
      setCameraAdded(false);  
    }
  };

  return (
    <div className="admin-manage-container">
      <Navbar />
      
      <div className="admin-table-container">
        <table className="admin-table">
          <tbody>
            {cameras.map((camera) => (
              <tr key={camera.id} className="admin-row">
                <td className="admin-camera">
                  <div className="camera-content">
                    <div className="camera-name">{camera.name}</div>
                    <div className="camera-description">{camera.description}</div>
                  </div>
                </td>
                <td className="admin-actions">
                  <button className="edit-btn">Edit</button>
                  <input
                    type="checkbox"
                    checked={camera.enabled}
                    onChange={() => toggleCameraStatus(camera.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="camera-controls">
        <button
          className="add-camera-btn"
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          Add Camera
        </button>
      </div>

      {isFormVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => setIsFormVisible(false)}>
              &times;
            </button>
            <div className="add-camera-form">
              <h2>Adding cameras</h2>
              
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
                <label>Camera ID</label>
                <input
                  type="text"
                  name="code"
                  placeholder="Camera ID"
                  value={newCamera.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Camera Description"
                  value={newCamera.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              
              <button className="submit-btn" onClick={handleAddCamera}>Submit</button>
            </div>
          </div>
        </div>
      )}

      <div className="camera-preview-area">
        {isAddingCamera ? (
          <div className="preview-placeholder">
            <div className="loading-spinner"></div>
            <p>Attempting to add camera</p>
          </div>
        ) : cameraAdded ? (
          <div className="preview-placeholder">
            <div className="success-checkmark">&#10003;</div> 
            <p>Camera successfully added!</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AdminCameraPage;
