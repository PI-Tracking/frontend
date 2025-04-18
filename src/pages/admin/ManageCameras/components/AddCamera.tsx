import styles from "./AddCamera.module.css";
import { Camera } from "@Types/Camera";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import * as Api from "@api/camera";
import CameraDTO from "@Types/CameraDTO";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

interface IAddCameraForm {
  setIsFormVisible: Dispatch<SetStateAction<boolean>>;
  editingCamera: Camera;
}

const COIMBRA: [number, number] = [40.202852, -8.410192];
export default function AddCameraForm({
  setIsFormVisible,
  editingCamera,
}: IAddCameraForm) {
  const [newCamera, setNewCamera] = useState<Camera>({
    ...editingCamera,
    //name: editingCamera.name,
    //latitude: editingCamera.latitude,
    //longitude: editingCamera.longitude,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState({
    completed: false,
    sucess: false,
  });

  const NewCameraMarker = () => {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        setNewCamera({
          ...newCamera,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });
    return newCamera.latitude ? (
      <Marker
        key={newCamera.id}
        position={[newCamera.latitude, newCamera.longitude]}
      />
    ) : null;
  };

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
        <div className={styles.cameraPreviewArea}>
          <div className={styles.previewPlaceholder}>
            <div className={styles.loadingSpinner}></div>
            <p>Attempting to add camera</p>
          </div>
        </div>
      </>
    );
  }

  if (status.completed) {
    return (
      <div className={styles.cameraPreviewArea}>
        {status.sucess ? (
          <div className={styles.previewPlaceholder}>
            <p className={styles.successCheckmark}>&#10003;</p>
            <p>Camera successfully saved! :D</p>
          </div>
        ) : (
          <div className={styles.previewPlaceholder}>
            <p className={styles.successCheckmark}>&#10005;</p>
            <p>Failure saving Camera :(</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button
            className={styles.modalCloseBtn}
            onClick={() => setIsFormVisible(false)}
          >
            &times;
          </button>
          <div className={styles.addCameraForm}>
            <h2>{editingCamera.id ? "Edit Camera" : "Add Camera"}</h2>

            <div className={styles.row}>
              <div className={styles.inputColumn}>
                <div className={styles.formGroup}>
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

                <div className={styles.formGroup}>
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

                <div className={styles.formGroup}>
                  <label>Longitude</label>
                  <input
                    name="longitude"
                    placeholder="Camera Longitude"
                    value={newCamera.longitude}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className={styles.mapColumn}>
                <MapContainer
                  center={
                    newCamera.latitude && newCamera.longitude // TODO fucking fix -
                      ? [newCamera.latitude, newCamera.longitude]
                      : COIMBRA
                  }
                  zoom={13}
                  style={{ height: "500px" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    {...{ attribution: "&copy; OpenStreetMap contributors" }}
                  />
                  <NewCameraMarker />
                  {
                    //{cameras.map((camera) => (
                    //  <Marker
                    //    key={camera.id}
                    //    position={[camera.latitude, camera.longitude]}
                    //    eventHandlers={{
                    //      click: () => handleSelectCamera(camera),
                    //    }}
                    //  >
                    //    <Popup>Camera {camera.name}</Popup>
                    //  </Marker>
                    //))}
                  }
                </MapContainer>
              </div>
            </div>
            <button className={styles.submitBtn} onClick={handleSubmit}>
              {editingCamera.id ? "Save Changes" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
