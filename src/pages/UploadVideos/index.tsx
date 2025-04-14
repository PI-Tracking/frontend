import { useCallback, useState, useRef, useEffect, ChangeEvent } from "react";
import { useDropzone } from "react-dropzone";
import CameraMenuOptions from "@components/CameraMenuOptions";
import Navbar from "@components/Navbar";
import "./UploadVideosPage.css";
import { MdUpload } from "react-icons/md";
import { AiOutlineFileAdd } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import SubmitFilesButton from "./components/SubmitFilesButton";
import { CamerasVideo } from "@Types/CamerasVideo";
import { getAllCameras } from "@api/camera";
import { ApiError } from "@api/ApiError";
import { Camera } from "@Types/Camera";
import { AxiosError } from "axios";

// i cannot allow him to add the same video twice, need to have that in mind

const Modal = ({
  fileName,
  onClose,
}: {
  fileName: string;
  onClose: () => void;
}) => {
  return (
    <div className="modal-overlay2">
      <div className="modal-content2">
        <h2>File Already Exists</h2>
        <p>
          A file with the name <strong>{fileName}</strong> already exists.
        </p>
        <button className="close-modal-button2" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

function UploadVideosPage() {
  const [videos, setVideos] = useState<CamerasVideo[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [duplicateFile, setDuplicateFile] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [cameras, setCameras] = useState<Camera[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  console.log(cameras);
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

  const handleChangeCamera = (
    event: ChangeEvent<HTMLSelectElement>,
    filename: string
  ) => {
    setVideos((prev) =>
      prev.map((video) => {
        if (video.file.name !== filename) {
          return video;
        }
        return {
          ...video,
          camera: cameras.find((camera) => camera.id === event.target.value)!,
        };
      })
    );
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
                  <select
                    key={video.file.name}
                    value={
                      video.camera.id === ""
                        ? "Select a camera for this video"
                        : video.camera.id
                    }
                    onChange={(event) =>
                      handleChangeCamera(event, video.file.name)
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
                  <IoClose
                    className="remove-file-icon"
                    onClick={() => removeFile(video.file.name)}
                  />
                </div>
              ))}
            </div>
          )}
          <SubmitFilesButton files={videos} setError={setErrorMessage} />
        </div>
      </section>
      <div className="menu-options">
        <CameraMenuOptions />
      </div>

      {showModal && <Modal fileName={duplicateFile} onClose={closeModal} />}
    </div>
  );
}

export default UploadVideosPage;
