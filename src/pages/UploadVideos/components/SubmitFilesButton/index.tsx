import { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";
import { createNewReport } from "@api/report";
import { NewReportDTO } from "@Types/NewReportDTO";
import { ApiError } from "@api/ApiError";
import CamerasVideo from "../types/CamerasVideo";
import { AxiosError } from "axios";
import { useMinIO } from "@hooks/useMinIO";
import { ReportResponseDTO, UploadData } from "@Types/ReportResponseDTO";

interface SubmitFilesButtonProps {
  files: CamerasVideo[];
  setError: Dispatch<SetStateAction<string>>;
}
function SubmitFilesButton({ files, setError }: SubmitFilesButtonProps) {
  const minio = useMinIO();

  const submitAnalysis = async () => {
    if (files.length === 0) {
      setError("Add files before submiting an analysis!");
      return;
    }
    if (!files.every((video) => video.cameraId !== "")) {
      setError("All cameras must be associated to a camera");
      return;
    }

    try {
      const response = await createNewReport({
        cameras: files.map((file) => file.cameraId),
        name: new Date().toUTCString(),
      } as NewReportDTO);

      console.log("Aii blyat", response);
      if (response.status !== 201) {
        setError((response.data as ApiError).message);
      }

      const { uploads }: ReportResponseDTO = response.data as ReportResponseDTO;
      uploads.forEach(async (upload: UploadData) => {
        const file: File = (
          files.find(
            (video) => video.cameraId === upload.cameraId
          ) as CamerasVideo
        ).file;

        await minio.uploadFile(file, upload.uploadUrl);
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ApiError>;
        setError(axiosError.response?.data.message || "Something went wrong.");
      }
    }
  };

  return (
    <div className={styles.row}>
      <button className={styles.submitButton} onClick={submitAnalysis}>
        Request Analysis
      </button>
    </div>
  );
}

export default SubmitFilesButton;
