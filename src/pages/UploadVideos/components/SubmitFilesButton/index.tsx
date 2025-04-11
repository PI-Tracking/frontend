import { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";
import { requestNewAnalysis } from "@api/analysis";

interface SubmitFilesButtonProps {
  files: File[];
  setError: Dispatch<SetStateAction<string>>;
}
function SubmitFilesButton({ files, setError }: SubmitFilesButtonProps) {
  const submitAnalysis = async () => {
    if (files.length === 0) {
      setError("Add files before submiting an analysis!");
      return;
    }

    const response = await requestNewAnalysis(
      files.map(() => "") // array of empty strings, to not add camerasID
    );
    if (response.status === 200) {
      return;
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
