import { ChangeEvent } from "react";
import { Detection } from "../types/Detection";
import styles from "./Player.module.css";

interface IProgressBar {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  detections: Detection[];
}

export default function ProgressBar({
  progress,
  setProgress,
  videoRef,
}: IProgressBar) {
  if (videoRef.current == null) {
    return <></>;
  }

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video == null) return;

    const newTime = (parseFloat(event.target.value) / 100) * video.duration;
    video.currentTime = newTime;
    setProgress(parseFloat(event.target.value));
  };

  return (
    <div style={{ width: "100%" }}>
      <input
        type="range"
        className={styles.progressBar}
        min="0"
        max="100"
        value={progress}
        onChange={handleSeek}
      />
      {
        //  detections.map((detection) => (
        //  <div
        //    key={detection.type}
        //    style={{
        //      position: "absolute",
        //      left: `${(detection.Box.points[0] / 100) * 100}%`,
        //      width: `${(detection.Box.points[2] / 100) * 100}%`,
        //      height: "100%",
        //      backgroundColor: "red",
        //    }}
        //  ></div>
        //))
      }
    </div>
  );
}
