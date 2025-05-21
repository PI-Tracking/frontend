import React, { useCallback, useEffect, useRef, useState, ReactNode } from "react";
import { AxiosError } from "axios";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useDropzone } from "react-dropzone";
import { MdUpload, MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineFileAdd } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { BsPinMap } from "react-icons/bs";

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
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [faceImage, setFaceImage] = useState<File | undefined>();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [cameras, setCameras] = useState<Camera[]>([]);
  const [videos, setVideos] = useState<CamerasVideo[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [duplicateFile, setDuplicateFile] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const [showMap, setShowMap] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");

  // Cleanup object URL for uploaded image to avoid memory leaks
  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  // Fetch cameras on mount
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await getAllCameras();
        if (response.status !== 200) {
          setErrorMessage(
            "Failure fetching cameras! " + (response.data as ApiError).message
          );
          return;
        }
        setCameras(response.data as Camera[]);
      } catch (error) {
        if (error instanceof AxiosError) {
          const axiosError = error as AxiosError<ApiError>;
          setErrorMessage(
            axiosError.response?.data.message ||
              `Failed to fetch cameras (error ${axiosError.status})`
          );
        }
      }
    };

    fetchCameras();
  }, []);

  // Handle files dropped in dropzone
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.filter((file) => {
        if (videos.some((existing) => existing.file.name === file.name)) {
          setDuplicateFile(file.name);
          setShowModal(true);
          return false;
        }
        return true;
      });

      // Allowed video mime types
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

      // Filter valid video files and map to CamerasVideo type with empty camera
      const validFiles: CamerasVideo[] = newFiles
        .filter((file) => videoFileTypes.includes(file.type))
        .map((file) => ({
          camera: { id: "" } as Camera,
          file,
        }));

      if (validFiles.length === newFiles.length) {
        setVideos((prev) => [...prev, ...validFiles]);
        setErrorMessage("");
      } else {
        setErrorMessage("Only video files are allowed!");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    },
    [videos]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    noClick: true,
  });

  // When user changes camera for a video
  const handleChangeCamera = (cameraId: UUID, filename: string) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.file.name === filename
          ? { ...video, camera: cameras.find((c) => c.id === cameraId)! }
          : video
      )
    );
  };

  // Open map modal to select camera location for a file
  const openMap = (filename: string) => {
    setSelectedFile(filename);
    setShowMap(true);
  };

  // Remove video file from list
  const removeFile = (fileName: string) => {
    setVideos((prev) => prev.filter((video) => video.file.name !== fileName));
  };

  // Trigger file input click for videos
  const handleAddFileClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Close duplicate file modal
  const closeModal = () => {
    setShowModal(false);
    setDuplicateFile("");
  };

  // Handle face image file selection and preview
  const handleFaceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cleanup previous URL if any
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setFaceImage(file);
    }
  };

  // Remove uploaded face image
  const removeFaceImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage("");
    setFaceImage(undefined);
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

          {/* Face image upload */}
          <div className="image-upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={handleFaceImageChange}
              style={{ display: "none" }}
              ref={imageInputRef}
            />
            <button
              className="upload-videos-button"
              onClick={() => imageInputRef.current?.click()}
            >
              Upload Image
            </button>

            {uploadedImage && (
              <div className="uploaded-image-preview">
                <img
                  src={uploadedImage}
                  alt="Uploaded Face"
                  style={{ maxWidth: "100%", marginTop: 10 }}
                />
                <button
                  className="remove-image-button"
                  onClick={removeFaceImage}
                  style={{
                    marginTop: 10,
                    display: "block",
                    marginInline: "auto",
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {/* Video files list */}
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
                      {cameras
                        .filter((camera) => camera.active)
                        .map((camera) => (
                          <option key={camera.id} value={camera.id}>
                            {camera.name}
                          </option>
                        ))}
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

          {/* Submit button */}
          <SubmitFilesButton
            files={videos}
            setError={setErrorMessage}
            faceImage={faceImage}
          />
        </div>
      </section>

      <div className="menu-options">
        <CameraMenuOptions />
      </div>

      {/* Duplicate file modal */}
      {showModal && (
        <Modal>
          <h2>File Already Exists</h2>
          <p>
            A file with the name <strong>{duplicateFile}</strong> already exists.
          </p>
          <button className="close-modal-button2" onClick={closeModal}>
            Close
          </button>
        </Modal>
      )}

      {/* Map modal for selecting camera location */}
      {showMap && (
        <section className="map-view">
          <MapContainer
            center={COIMBRA}
            zoom={13}
            style={{ height: 400, width: "100%" }}
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
              attribution="&copy; OpenStreetMap contributors"
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
  