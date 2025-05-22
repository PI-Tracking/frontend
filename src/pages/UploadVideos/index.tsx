import { AxiosError } from "axios";
import { useCallback, useState, useRef, useEffect, ReactNode } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useDropzone } from "react-dropzone";
import { MdUpload } from "react-icons/md";
import { AiOutlineFileAdd } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { BsPinMap } from "react-icons/bs";
import { toast } from "react-toastify";
// import {
//   Box,
//   Button,
//   Container,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import SubmitFilesButton from "./components/SubmitFilesButton";
import CameraMenuOptions from "@components/CameraMenuOptions";
import Navbar from "@components/Navbar";

import { Camera } from "@Types/Camera";
import { UUID } from "@Types/Base";
import { CamerasVideo } from "@Types/CamerasVideo";

import { getAllCameras } from "@api/camera";
import { ApiError } from "@api/ApiError";

import "./UploadVideosPage.css";

const Modal = ({ children }: { children: ReactNode }) => {
  return (
    <div className="modal-overlay2">
      <div className="modal-content2">{children}</div>
    </div>
  );
};

const COIMBRA: [number, number] = [40.202852, -8.410192];
function UploadVideosPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [videos, setVideos] = useState<CamerasVideo[]>([]);
  const [referenceImage, setReferenceImage] = useState<File | undefined>(
    undefined
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [duplicateFile, setDuplicateFile] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [showMap, setShowMap] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("");

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await getAllCameras();

        if (response.status !== 200) {
          setErrorMessage(
            "Failure fetching cameras! " + (response.data as ApiError).message
          );
        }
        setCameras(response.data as Camera[]);
      } catch (error) {
        if (error instanceof AxiosError) {
          const axiosError = error as AxiosError<ApiError>;

          setErrorMessage(
            axiosError.response?.data.message ||
            `Failed to fetch cameras (error${axiosError.status})`
          );
        }
      }
    };

    fetchCameras();
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.filter((file) => {
        if (
          videos.some((existingFile) => existingFile.file.name === file.name)
        ) {
          setDuplicateFile(file.name);
          setShowModal(true);
          return false;
        }
        return true;
      });

      const videoFileTypes = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
        "video/x-matroska",
        "video/3gpp",
        "video/3gpp2",
        "video/mpeg",
        "video/x-msvideo",
        "video/x-flv",
        "video/x-ms-wmv",
        "video/x-ms-asf",
        "video/x-m4v",
      ];

      const validFiles: CamerasVideo[] = newFiles
        .filter((file) => videoFileTypes.includes(file.type))
        .map((file) => {
          return {
            camera: { id: "" } as Camera,
            file: file,
          } as CamerasVideo;
        });

      if (validFiles.length === newFiles.length) {
        setVideos((prevFiles) => [...prevFiles, ...validFiles]);
        setErrorMessage("");
      } else {
        setErrorMessage("Only video files are allowed!");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      }
    },
    [videos]
  );

  const handleChangeCamera = (cameraId: UUID, filename: string) => {
    setVideos((prev) =>
      prev.map((video) => {
        if (video.file.name !== filename) {
          return video;
        }
        return {
          ...video,
          camera: cameras.find((camera) => camera.id === cameraId)!,
        };
      })
    );
  };

  const openMap = (filename: string) => {
    setSelectedFile(filename);
    setShowMap(true);
  };

  const removeFile = (fileName: string) => {
    setVideos((prevVideos) =>
      prevVideos.filter((video) => video.file.name !== fileName)
    );
  };
  // We can also put the acecpet here, i dont have any videos to test
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    noClick: true,
  });

  const handleAddFileClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setDuplicateFile("");
  };

  const handleReferenceImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // First create a preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setReferenceImage(file);
    }
  };

  const handleAddImageClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  return (
    <div className="container">
      <Navbar />
      <section className="upload-videos">
        <div {...getRootProps()} className="video-uploader-container">
          <input {...getInputProps()} ref={inputRef} />
          {!videos.length && (
            <div className="upload-videos-icon">
              <MdUpload />
            </div>
          )}
          {isDragActive ? (
            <p className="upload-videos-text">Drop the files here...</p>
          ) : (
            <p className="upload-videos-text">
              {errorMessage || "Drop to upload or analyze"}
            </p>
          )}
          <button className="upload-videos-button" onClick={handleAddFileClick}>
            <AiOutlineFileAdd />
            {videos.length ? "Add more files" : "Select file"}
            <MdKeyboardArrowDown />
          </button>
          {videos.length > 0 && (
            <div className="uploaded-files-container">
              {videos.map((video) => (
                <div key={video.file.name} className="uploaded-file">
                  <span>
                    <p className="file-name">{video.file.name}</p>
                    <p className="file-size">
                      {(video.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </span>
                  <span style={{ display: "flex", gap: "0.5rem" }}>
                    <select
                      key={video.file.name}
                      value={
                        video.camera.id === ""
                          ? "Select a camera for this video"
                          : video.camera.id
                      }
                      onChange={(event) =>
                        handleChangeCamera(event.target.value, video.file.name)
                      }
                    >
                      <option hidden>Select a camera</option>
                      {cameras.map((camera) =>
                        camera.active ? (
                          <option value={camera.id} key={camera.id}>
                            {camera.name}
                          </option>
                        ) : null
                      )}
                    </select>
                    <BsPinMap
                      onClick={() => openMap(video.file.name)}
                      style={{ cursor: "pointer" }}
                    />
                  </span>
                  <IoClose
                    className="remove-file-icon"
                    onClick={() => removeFile(video.file.name)}
                  />
                </div>
              ))}
            </div>
          )}
          <SubmitFilesButton
            files={videos}
            suspect={referenceImage}
            setError={setErrorMessage}
          />

          <div className="face-detection-section">
            <h3>Face Detection</h3>
            <div className="reference-image-container">
              <button
                className="upload-videos-button"
                onClick={handleAddImageClick}
              >
                <AiOutlineFileAdd />
                {referenceImage
                  ? "Change Reference Image"
                  : "Select Reference Image"}
                <MdKeyboardArrowDown />
              </button>
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleReferenceImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              {previewUrl && (
                <div className="reference-image-preview">
                  <img
                    src={previewUrl}
                    alt="Reference"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="menu-options">
        <CameraMenuOptions />
      </div>

      {showModal && (
        <Modal>
          <h2>File Already Exists</h2>
          <p>
            A file with the name <strong>{duplicateFile}</strong> already
            exists.
          </p>
          <button className="close-modal-button2" onClick={closeModal}>
            Close
          </button>
        </Modal>
      )}

      {showMap && (
        <section className="map-view">
          <MapContainer
            center={COIMBRA}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <button
              className="close-modal-button2"
              onClick={() => {
                setShowMap(false);
                setSelectedFile("");
              }}
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
                  click: () => {
                    handleChangeCamera(camera.id, selectedFile);
                    setShowMap(false);
                    setSelectedFile("");
                  },
                }}
              >
                <Popup>Camera {camera.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      )}
    </div>
  );
}

export default UploadVideosPage;
