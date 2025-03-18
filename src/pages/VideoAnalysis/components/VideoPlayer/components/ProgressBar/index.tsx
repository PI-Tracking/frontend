import { ChangeEvent } from "react";
import { Detection } from "../types/Detection";
import styles from "./Player.module.css";
import { Dispatch, SetStateAction } from "react";
import { PauseIcon, PlayIcon } from "lucide-react";

interface IProgressBar {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  detections: Detection[];

  progress: number;
  setProgress: Dispatch<SetStateAction<number>>;

  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
}

export default function ProgressBar({
  videoRef,
  progress,
  setProgress,
  playing,
  setPlaying,
  detections,
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

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };
  return (
    <div style={{ width: "100%" }}>
      <button onClick={togglePlay} className={styles.playButton}>
        {/*  Alter here the color of the icons  */}
        {playing ? (
          <PauseIcon fill="#FFFFFF" strokeWidth={0} />
        ) : (
          <PlayIcon fill="#4335FF" strokeWidth={0} />
        )}
      </button>

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
