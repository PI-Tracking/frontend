import { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";
import { createNewReport } from "@api/report";
import { NewReportDTO } from "@Types/NewReportDTO";
//import { ApiError } from "@api/ApiError";
import CamerasVideo from "../types/CamerasVideo";

interface SubmitFilesButtonProps {
  files: CamerasVideo[];
  setError: Dispatch<SetStateAction<string>>;
}
function SubmitFilesButton({ files, setError }: SubmitFilesButtonProps) {
  const submitAnalysis = async () => {
    if (files.length === 0) {
      setError("Add files before submiting an analysis!");
      return;
    }

    try {
      const response = await createNewReport({
        cameras: files.map((file) => file.cameraId),
        name: "name????",
      } as NewReportDTO);
      if (response.status !== 201) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      //if (error instanceof ApiError)
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
