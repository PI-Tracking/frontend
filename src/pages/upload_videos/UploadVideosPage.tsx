import CameraMenuOptions from "@components/CameraMenuOptions.tsx";
import Navbar from "../../components/Navbar.tsx";
import "./UploadVideosPage.css";
import { MdUpload } from "react-icons/md";
import { AiOutlineFileAdd } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";

function UploadVideosPage() {
  return (
    <div className="container">
      <Navbar />
      <section className="upload-videos">
        <div className="video-uploader-container">
          <div className="upload-videos-icon">
            <MdUpload />
          </div>
          <p className="upload-videos-text">Drop to upload or analyze</p>
          <button className="upload-videos-button">
            <AiOutlineFileAdd />
            Select file
            <MdKeyboardArrowDown />
          </button>
        </div>
      </section>
      <div className="menu-options">
        <CameraMenuOptions />
      </div>
    </div>
  );
}

export default UploadVideosPage;
