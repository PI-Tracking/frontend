import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@components/Navbar";
import CameraMenuOptions from "@components/CameraMenuOptions";
import "./CamerasPageMap.css";

interface Camera {
  id: number;
  lat: number;
  lng: number;
}

const dummyCameras: Camera[] = [
  { id: 1, lat: 39.495, lng: -7.84 },
  { id: 2, lat: 41.515, lng: -7.33 },
  { id: 3, lat: 37.525, lng: -7.12 },
];

function CamerasPageMap() {
  const [showMap, setShowMap] = useState<boolean>(false);
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);

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
            center={[40.366715, -8.036196]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              {...{ attribution: "&copy; OpenStreetMap contributors" }}
            />
            {dummyCameras.map((camera) => (
              <Marker
                key={camera.id}
                position={[camera.lat, camera.lng]}
                eventHandlers={{
                  click: () => handleSelectCamera(camera),
                }}
              >
                <Popup>Camera {camera.id}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      )}

      {selectedCameras.length > 0 && (
        <section className="camera-feed">
          {selectedCameras.map((camera) => (
            <div key={camera.id} className="camera-view">
              Camera {camera.id}
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
