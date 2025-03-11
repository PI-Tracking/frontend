import { useState } from "react";
import CameraMenuOptions from "@components/CameraMenuOptions.tsx";
import Navbar from "../../components/Navbar/Navbar.tsx";
import "./CamerasPage.css";

const dummyCameras = Array(9).fill(null); 

// for some reason the carousel is showing X-1 cameras

function CamerasPage() {
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);

  const handleCameraClick = (index: number) => {
    setSelectedCamera(index === selectedCamera ? null : index); 
  };

  return (
    <div className="container">
      <Navbar />

      {selectedCamera === null ? (
        <section className="cameras">
          {dummyCameras.map((_, index) => (
            <div
              key={index}
              className="camera-feed"
              onClick={() => handleCameraClick(index)}
            >
              Camera {index + 1}
            </div>
          ))}
        </section>
      ) : (
        <>
          <section className="main-view" onClick={() => setSelectedCamera(null)}>
            <div className="highlighted-camera">
              Camera {selectedCamera + 1}
            </div>
          </section>

          <section className="carousel">
            {dummyCameras
              .filter((_, index) => index !== selectedCamera)
              .map((_, index) => (
                <div
                  key={index}
                  className="camera-feed"
                  onClick={() => handleCameraClick(index)}
                >
                  Camera {index + 1}
                </div>
              ))}
          </section>
        </>
      )}

      <div className="menu-options">
        <CameraMenuOptions />
      </div>
    </div>
  );
}

export default CamerasPage;
