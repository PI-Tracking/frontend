import { useState, useEffect, useMemo } from "react";
import CameraMenuOptions from "@components/CameraMenuOptions";
import Navbar from "@components/Navbar";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";

// Icon to represent direction
const arrowIcon = (angle: number) =>
  L.divIcon({
    html: `<div style="transform: rotate(${angle}deg); font-size:40px; color:red">▲</div>`,
    iconSize: [50, 50],
    className: "arrow-icon",
  });

// Calculate direction based on two coordinates
function calculateBearing(start: [number, number], end: [number, number]) {
  const [lat1, lon1] = start.map((deg) => (deg * Math.PI) / 180);
  const [lat2, lon2] = end.map((deg) => (deg * Math.PI) / 180);

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  const theta = Math.atan2(y, x);
  return ((theta * 180) / Math.PI + 360) % 360; // convert to degrees
}

function MapTrackingPage() {
  // Temporary fake detections
  const [detections, setDetections] = useState<string[]>([]);
  const [center, setCenter] = useState<[number, number]>([
    40.202852, -8.410192,
  ]);

  useEffect(() => {
    // Temporary fake detections
    const fakeDetections: string[] = [
      "40.202852, -8.410192",
      "40.202852, -8.420192",
      "40.202852, -8.430192",
      "40.302852, -8.540192",
    ];
    setDetections(fakeDetections);
    setCenter([40.202852, -8.410192]);
  }, []);

  // Temporary convertion of fake detections
  const coordinates = useMemo(() => {
    return detections.map((d) => {
      const [lat, lng] = d.split(",").map(Number);
      return [lat, lng] as [number, number];
    });
  }, [detections]);

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
          {coordinates.map((pos, idx) => (
            <Marker key={idx} position={pos} />
          ))}

          {coordinates.length > 1 && (
            <Polyline positions={coordinates} pathOptions={{ color: "blue" }} />
          )}

          {/* Directional Arrows */}
          {coordinates.map((point, index) => {
            if (index === 0 || index >= coordinates.length) return null;
            const from = coordinates[index - 1];
            const to = point;
            const angle = calculateBearing(from, to);

            return (
              <Marker
                key={`arrow-${index}`}
                position={from}
                icon={arrowIcon(angle)}
              />
            );
          })}
        </MapContainer>
      </section>

      <div className="menu-options">
        <CameraMenuOptions />
      </div>
    </div>
  );
}

export default MapTrackingPage;
