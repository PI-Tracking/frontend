import { Dispatch, SetStateAction, useState } from "react";
import styles from "./styles.module.css";
import { createNewReport } from "@api/report";
import { NewReportDTO } from "@Types/NewReportDTO";
import { ApiError } from "@api/ApiError";
import { CamerasVideo } from "@Types/CamerasVideo";
import { AxiosError } from "axios";
import { useMinIO } from "@hooks/useMinIO";
import { ReportResponseDTO } from "@Types/ReportResponseDTO";

interface SubmitFilesButtonProps {
  files: CamerasVideo[];
  setError: Dispatch<SetStateAction<string>>;
}
function SubmitFilesButton({ files, setError }: SubmitFilesButtonProps) {
  const minio = useMinIO();
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);

  const submitAnalysis = async () => {
    if (files.length === 0) {
      setError("Add files before submiting an analysis!");
      return;
    }
    if (
      !files.every((video) => video.cameraId !== "") ||
      new Set(files.map((video) => video.cameraId)).size !== files.length
    ) {
      setError("All cameras must be associated to (different) camera");
      return;
    }

    try {
      const response = await createNewReport({
        cameras: files.map((file) => file.cameraId),
        name: new Date().toUTCString(),
      } as NewReportDTO);

      if (response.status !== 201) {
        setError((response.data as ApiError).message);
      }

      const { uploads } = response.data as ReportResponseDTO;

      for (const upload of uploads) {
        console.log("From url:", upload);
        const file: File = (
          files.find(
            (video) => video.cameraId === upload.cameraId
          ) as CamerasVideo
        ).file;
        console.log("Uploading: " + file.name);

        setUploadingFile(file);
        await minio.uploadFile(file, upload.uploadUrl);
      }
      setUploadingFile(null);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ApiError>;
        setError(axiosError.response?.data.message || "Something went wrong.");
      }
    }
  };

  document.documentElement.style.setProperty(
    "--progress-position",
    `${Math.ceil(minio.progress * 100) / 100}`
  );

  return (
    <div className={styles.row}>
      <button className={styles.submitButton} onClick={submitAnalysis}>
        Request Analysis
      </button>
      {uploadingFile !== null ? (
        <div className={styles.row}>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar}></div>
          </div>
          <p>Uploading file {uploadingFile?.name}</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default SubmitFilesButton;
