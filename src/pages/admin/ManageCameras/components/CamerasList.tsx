import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

import { Dispatch, SetStateAction } from "react";
import "../AdminCameraPage.css";
import { Camera } from "@Types/Camera";

interface ICamerasList {
  setEditingCamera: Dispatch<SetStateAction<Camera>>;
  openForm: () => void;
  toggleCameraActive: () => void;
  camera: Camera;
}

export default function CamerasList({
  camera,
  setEditingCamera,
  openForm,
  toggleCameraActive,
}: ICamerasList) {
  const handleEditCamera = () => {
    setEditingCamera(camera);
    openForm();
  };

  return (
    <tbody>
      <tr key={camera.id} className="admin-row">
        <td className="admin-camera">
          <div className="camera-content">
            <div className="camera-name">{camera.name}</div>
            <div className="camera-description">
              <p>lat: {camera.latitude}</p>
              <p>lon: {camera.longitude}</p>
            </div>
          </div>
        </td>
        <td className="admin-actions flex gap-2">
          <button>
            <ArrowDownTrayIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
          </button>
          <button>
            <DocumentTextIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
          </button>
          <button onClick={() => handleEditCamera()}>
            <PencilSquareIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
          </button>
        </td>
        <td className="admin-checkbox">
          <input
            type="checkbox"
            checked={camera.active}
            onChange={() => toggleCameraActive()}
          />
        </td>
      </tr>
    </tbody>
  );
}
