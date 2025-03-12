import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StatusCodes } from "http-status-codes";

import "../AdminCameraPage.css";
import * as Api from "@api/camera";
import Camera from "@Types/Camera";

interface ICamerasList {
  setEditingCamera: Dispatch<SetStateAction<Camera>>;
}

export default function CamerasList({ setEditingCamera }: ICamerasList) {
  const [cameraList, setCameras] = useState<Camera[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getAllCameras() {
      try {
        const { data: allCameras, status } = await Api.getAllCameras();

        if (status == StatusCodes.OK) {
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
  }, []);

  const handleEditCamera = (camera: Camera) => {
    setEditingCamera(camera);
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
    <div className="admin-table-container">
      <table className="admin-table">
        <tbody>
          {cameraList.map((camera: Camera) => (
            <tr key={camera.id} className="admin-row">
              <td className="admin-camera">
                <div className="camera-content">
                  <div className="camera-name">{camera.name}</div>
                  <div className="camera-description">
                    `lat: ${camera.latitude};lon: ${camera.longitude}`
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
                <button onClick={() => handleEditCamera(camera)}>
                  <PencilSquareIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
