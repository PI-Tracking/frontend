import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@components/Navbar";
import CameraMenuOptions from "@components/CameraMenuOptions";
import "./CamerasPageMap.css";
import { getAllCameras } from "@api/camera";
import { Camera } from "@Types/Camera";
import VideoViewer from "./components/VideoViewer";
import { requestNewAnalysis, stopAnalysis } from "@api/analysis";

const COIMBRA: [number, number] = [40.202852, -8.410192];

type Frames = {
  [camera: string]: string;
};

function CamerasPageMap() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [liveAnalysisId, setLiveAnalysisId] = useState("0");

  const [frames, setFrames] = useState<Frames>({});

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

  const handleSelectCamera = async (camera: Camera) => {
    if (!selectedCameras.some((c) => c.id === camera.id)) {
      setSelectedCameras([...selectedCameras, camera]);
    }
    await handleStopLiveAnalysis();
    await handleStartLiveAnalysis();
    setShowMap(false);
  };

  const handleStartLiveAnalysis = async () => {
    await requestNewAnalysis(selectedCameras.map((c) => c.id));

    const analysisId = String(Math.floor(Math.random() * 1_000_000));

    const websocket = new WebSocket(
      `ws://localhost:8000/api/v1/live/ws/${analysisId}`
    );

    setLiveAnalysisId(analysisId);

    websocket.onopen = () => {
      console.log("Live WS Opened");
    };

    websocket.onmessage = (event) => {
      const json = JSON.parse(event.data);

      const cameraId = json.camera_id;

      setFrames((prev) => {
        return { ...prev, [cameraId]: json.frame };
      });
    };

    setWs(websocket);
  };

  const handleStopLiveAnalysis = async () => {
    if (ws !== null) {
      ws.close();
      setWs(null);
    }

    await stopAnalysis(liveAnalysisId);
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

      <div className="viewer-wrapper">
        {selectedCameras.map((camera) => (
          <VideoViewer key={camera.id} frame={frames[camera.id]} />
        ))}
      </div>

      <div className="menu-options">
        <CameraMenuOptions />
      </div>
    </div>
  );
}

export default CamerasPageMap;
