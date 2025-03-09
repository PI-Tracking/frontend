import CameraMenuOptions from "@components/CameraMenuOptions.tsx";
import Navbar from "../../components/Navbar.tsx";
import "./CamerasPage.css";

const dummyCameras = Array(10).fill(null); /// needs to be replaced woith the cameras after

function CamerasPage() {
  return (
    <div className="container">
      <Navbar />
      <section className="cameras">
        {dummyCameras.map((_, index) => (
          <div key={index} className="camera-feed">
            Camera {index + 1}
          </div>
        ))}
      </section>
      <div className="menu-options">
        <CameraMenuOptions />
      </div>
    </div>
  );
}

export default CamerasPage;
