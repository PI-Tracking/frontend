import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import CameraMenuOptions from "@components/CameraMenuOptions";
import Navbar from "@components/Navbar";
import "./UploadVideosPage.css";
import { MdUpload } from "react-icons/md";
import { AiOutlineFileAdd } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import SubmitFilesButton from "./components/SubmitFilesButton";

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
  const [files, setFiles] = useState<File[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [duplicateFile, setDuplicateFile] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.filter((file) => {
        if (files.some((existingFile) => existingFile.name === file.name)) {
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

      const validFiles = newFiles.filter((file) =>
        videoFileTypes.includes(file.type)
      );

      if (validFiles.length === newFiles.length) {
        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
        setErrorMessage("");
      } else {
        setErrorMessage("Only video files are allowed!");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      }
    },
    [files]
  );

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
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
          {!files.length && (
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
            {files.length ? "Add more files" : "Select file"}
            <MdKeyboardArrowDown />
          </button>
          {files.length > 0 && (
            <div className="uploaded-files-container">
              {files.map((file) => (
                <div key={file.name} className="uploaded-file">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <IoClose
                    className="remove-file-icon"
                    onClick={() => removeFile(file.name)}
                  />
                </div>
              ))}
            </div>
          )}
          <SubmitFilesButton files={files} setError={setErrorMessage} />
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
