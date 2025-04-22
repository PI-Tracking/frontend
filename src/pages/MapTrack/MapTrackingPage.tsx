import { useState, useEffect, useMemo } from "react";
import CameraMenuOptions from "@components/CameraMenuOptions";
import Navbar from "@components/Navbar";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";

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
      "40.202852, -8.410192",
      "40.302852, -8.540192",
      "40.202852, -8.410192",
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

  // For repeated coordinates, add a small offset to avoid overlap in leaflet
  const jitteredCoordinates = useMemo(() => {
    const seen = new Map<string, number>();

    return coordinates.map(([lat, lng]) => {
      const key = `${lat},${lng}`;
      const count = seen.get(key) ?? 0;
      seen.set(key, count + 1);

      const offset = 0.0001 * count; // ~5 meters
      return [lat + offset, lng + offset] as [number, number];
    });
  }, [coordinates]);

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
          {jitteredCoordinates.map((pos, idx) => (
            <Marker
              key={`${pos[0]}-${pos[1]}-${idx}`}
              position={pos}
              icon={L.divIcon({
                html: `
                  <div style="
                    background: white;
                    border: 2px solid black;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 14px;
                    color: black;
                    line-height: 30px;
                  ">
                    ${idx + 1}
                  </div>
                `,
                className: "leaflet-numbered-icon",
                iconSize: [30, 30],
                iconAnchor: [15, 15],
              })}
            />
          ))}

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
