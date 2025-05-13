import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@components/Navbar";
import CameraMenuOptions from "@components/CameraMenuOptions";
import "./CamerasPageMap.css";
import { getAllCameras } from "@api/camera";
import { Camera } from "@Types/Camera";

const COIMBRA: [number, number] = [40.202852, -8.410192];
function CamerasPageMap() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await getAllCameras();
        if (response.status == 200 && response.data instanceof Array) {
          setCameras(response.data);
        }
      } catch {
        alert(" There was an unexpected error with the request.");
      }
    };
    fetchCameras();
  }, []);

  const handleAddCamera = (): void => {
    setShowMap(true);
  };

  const handleSelectCamera = (camera: Camera): void => {
    if (!selectedCameras.some((c) => c.id === camera.id)) {
      setSelectedCameras([...selectedCameras, camera]);
    }
    setShowMap(false);
  };

  return (
    <div className="container">
      <Navbar />

      {!showMap ? (
        <section className="add-camera" onClick={handleAddCamera}>
          <div className="add-camera-box">+</div>
        </section>
      ) : (
        <section className="map-view">
          <MapContainer
            center={COIMBRA}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <button
              className="close-modal-button2"
              onClick={() => setShowMap(false)}
            >
              Close
            </button>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              {...{ attribution: "&copy; OpenStreetMap contributors" }}
            />
            {cameras.map((camera) => (
              <Marker
                key={camera.id}
                position={[camera.latitude, camera.longitude]}
                eventHandlers={{
                  click: () => handleSelectCamera(camera),
                }}
              >
                <Popup>Camera {camera.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      )}

      {selectedCameras.length > 0 && (
        <section className="camera-feed">
          {selectedCameras.map((camera) => (
            <div key={camera.id} className="camera-view">
              Camera {camera.name}
            </div>
          ))}
        </section>
      )}

      <div className="menu-options">
        <CameraMenuOptions />
      </div>
    </div>
  );
}

export default CamerasPageMap;
