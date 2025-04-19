import styles from "./AddCamera.module.css";
import { Camera } from "@Types/Camera";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import * as Api from "@api/camera";
import CameraDTO from "@Types/CameraDTO";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  Popup,
} from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import L from "leaflet";

interface IAddCameraForm {
  setIsFormVisible: Dispatch<SetStateAction<boolean>>;
  editingCamera: Camera;
  allCameras: Camera[];
}

const greenIcon = new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png`,
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
function isValidCoords(lat: number, lon: number): boolean {
  // if no number
  if (lat === undefined || lon === undefined || lat === null || lon === null)
    return false;

  // If doesnt match expression
  const re = new RegExp("^-?[0-9]*(.[0-9]+)?");
  if (!re.test(lat.toString()) || !re.test(lon.toString())) return false;

  // if match lat and long restrictions
  return -90 <= lat && lat <= 90 && -180 <= lon && lon <= 180;
}

const COIMBRA: [number, number] = [40.202852, -8.410192];
export default function AddCameraForm({
  setIsFormVisible,
  editingCamera,
  allCameras,
}: IAddCameraForm) {
  const [newCamera, setNewCamera] = useState<Camera>({
    ...editingCamera,
  });
  const cameras: Camera[] =
    allCameras?.filter((camera) => camera.id !== newCamera.id) ?? [];

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
    return isValidCoords(newCamera.latitude, newCamera.longitude) ? (
      <Marker
        icon={greenIcon}
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
                    type="number"
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
                    isValidCoords(newCamera.latitude, newCamera.longitude) // TODO fucking fix -
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
                  {cameras.map((camera: Camera) => (
                    <Marker
                      key={camera.id}
                      position={[camera.latitude, camera.longitude]}
                    >
                      <Popup>Camera {camera.name}</Popup>
                    </Marker>
                  ))}
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
