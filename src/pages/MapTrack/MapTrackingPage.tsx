import { useState, useEffect, useMemo } from "react";
import CameraMenuOptions from "@components/CameraMenuOptions";
import Navbar from "@components/Navbar";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import useReportStore from "@hooks/useReportStore";
import "./MapTrackingPage.css";
import { getAnalysisByReportId } from "@api/report";
import { getAnalysisDetections } from "@api/analysis";
import { CameraTimeIntervalDTO } from "@Types/CameraTimeIntervalDTO";
import { getAllCameras } from "@api/camera";
import { ApiError } from "@api/ApiError";
import { Camera } from "@Types/Camera";

function MapTrackingPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const { report } = useReportStore();
  const [realDetections, setRealDetections] = useState<CameraTimeIntervalDTO[]>(
    []
  );
  const locationUsage = new Map<string, number>();
  const [center, setCenter] = useState<[number, number]>([
    40.202852, -8.410192,
  ]);

  const coordinates = useMemo(() => {
    return realDetections
      .map((detection) => {
        const cam = cameras.find((c) => c.id === detection.cameraId);
        return cam ? ([cam.latitude, cam.longitude] as [number, number]) : null;
      })
      .filter((coord): coord is [number, number] => coord !== null);
  }, [realDetections, cameras]);

  useEffect(() => {
    if (!report?.id) return;

    const fetchCameras = async () => {
      try {
        const response = await getAllCameras();

        if (response.status !== 200) {
          console.error(
            "Failure fetching cameras! " + (response.data as ApiError).message
          );
        }
        setCameras(response.data as Camera[]);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    const fetchDetections = async () => {
      try {
        const analysis = await getAnalysisByReportId(report.id);
        if ("data" in analysis && Array.isArray(analysis.data)) {
          const last = analysis.data[analysis.data.length - 1];
          const response = await getAnalysisDetections(last.id);
          const detections = response.data as CameraTimeIntervalDTO[];
          setRealDetections(detections);
          const firstDetection = detections[0];
          if (firstDetection) {
            const lat = cameras.find(
              (camera) => camera.id === firstDetection.cameraId
            )?.latitude;
            const lng = cameras.find(
              (camera) => camera.id === firstDetection.cameraId
            )?.longitude;
            if (lat && lng) {
              setCenter([lat, lng]);
            }
          }
        } else {
          console.error("Invalid response format:", analysis);
        }
      } catch (error) {
        console.error("Error fetching detections:", error);
      }
    };

    fetchCameras();
    fetchDetections();
  }, [report.id, cameras]);

  return (
    <div className="container">
      <Navbar />
      <section className="map-view">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {realDetections.map((detection, idx) => {
            const camera = cameras.find((cam) => cam.id === detection.cameraId);
            if (!camera) return null;

            const locKey = `${camera.latitude},${camera.longitude}`;
            const count = locationUsage.get(locKey) ?? 0;
            // Offset the marker position slightly to avoid overlap of numbers
            const offsetLat = camera.latitude;
            const offsetLng = camera.longitude + 0.0005 * count;

            locationUsage.set(locKey, count + 1);

            return (
              <Marker
                key={`${camera.id}-${idx}`}
                position={[offsetLat, offsetLng]}
                icon={L.divIcon({
                  html: `<div class="leaflet-numbered-icon">${idx + 1}</div>`,
                  className: "leaflet-numbered-icon",
                  iconSize: [30, 30],
                  iconAnchor: [15, 15],
                })}
              />
            );
          })}
          {coordinates.length > 1 && (
            <Polyline positions={coordinates} pathOptions={{ color: "blue" }} />
          )}
        </MapContainer>
      </section>

      <div className="menu-options">
        <CameraMenuOptions />
      </div>
    </div>
  );
}

export default MapTrackingPage;
