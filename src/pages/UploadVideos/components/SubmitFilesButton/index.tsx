import { Dispatch, SetStateAction, useState } from "react";
import styles from "./styles.module.css";
import { createNewReport } from "@api/report";
import { NewReportDTO } from "@Types/NewReportDTO";
import { ApiError } from "@api/ApiError";
import { CamerasVideo } from "@Types/CamerasVideo";
import { AxiosError } from "axios";
import { useMinIO } from "@hooks/useMinIO";
import { ReportResponseDTO } from "@Types/ReportResponseDTO";
import useReport from "@hooks/useReportStore";
import { useAuth } from "@hooks/useAuth";
import { Report } from "@Types/Report";
import { User } from "@Types/User";
import { VideoAnalysis } from "@Types/VideoAnalysis";
import { useNavigate } from "react-router-dom";
import { requestReanalysis } from "@api/analysis";

interface SubmitFilesButtonProps {
  files: CamerasVideo[];
  setError: Dispatch<SetStateAction<string>>;
  faceImage?: File;
}
function SubmitFilesButton({ files, setError, faceImage }: SubmitFilesButtonProps) {
  const minio = useMinIO();
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  // const [faceImage, setFaceImage] = useState<File | undefined>();

  const { setReport, setInitialAnalysisId } = useReport();
  const auth = useAuth();
  const navigate = useNavigate();

  const submitAnalysis = async () => {
    if (files.length === 0) {
      setError("Add files before submiting an analysis!");
      return;
    }
    if (
      !files.every((video) => video.camera.id !== "") ||
      new Set(files.map((video) => video.camera.id)).size !== files.length
    ) {
      setError("All cameras must be associated to (different) camera");
      return;
    }

    try {
      /* Create a new Report Request */ 
      const request: NewReportDTO = {
        cameras: files.map((file) => file.camera.id),
        name: new Date().toUTCString(),
        hasSuspect: !!faceImage,
      };
      const response = await createNewReport(request);

      if (response.status !== 201) {
        setError((response.data as ApiError).message);
      }
        
      /* Upload Files to MinIO */
      const { id, name, uploads } = response.data as ReportResponseDTO;
      for (const upload of uploads) {
        console.log("From url:", upload);
        const file: File = (
          files.find(
            (video) => video.camera.id === upload.cameraId
          ) as CamerasVideo
        ).file;
        console.log("Uploading: " + file.name);

        setUploadingFile(file);
        await minio.uploadFile(file, upload.uploadUrl);
      }
      setUploadingFile(null);

      /* Save state to use in videoAnalysis */
      const newReport: Report = {
        id: id,
        name: name,
        creator: auth.user || ({} as User),
        createdAt: new Date(request.name), // TODO if this changes, this HAS to change
        uploads: files.map((video) => {
          return {
            analysis_id: "",
            video_id: uploads.find(
              (upload) => upload.cameraId == video.camera.id
            )!.id,
            camera: video.camera,
            video: URL.createObjectURL(video.file),
            currentTimestamp: 0,
            detections: [],
            segmentations: [],
          } as VideoAnalysis;
        }),
      };
      setReport(newReport);

      const requestAnalysisResponse = await requestReanalysis(id, undefined, faceImage);
      if (requestAnalysisResponse.status !== 200) {
        setError((requestAnalysisResponse.data as ApiError).message);
        return;
      }
      /* Navigate to video analysis page */
      setInitialAnalysisId(
        (requestAnalysisResponse.data as { analysisId: string }).analysisId
      );
      navigate(`/report/${id}`);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ApiError>;
        setError(axiosError.response?.data.message || "Something went wrong.");
      }
    }
  };

  /* Upload progresss bar */
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
          <p>
            Uploading file {uploadingFile?.name} ({minio.progress}%)
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default SubmitFilesButton;
