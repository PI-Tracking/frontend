import {
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useState,
  useEffect,
} from "react";
import { PauseIcon, PlayIcon } from "lucide-react";
import { Detection } from "@Types/Detection";
import styles from "./styles.module.css";

interface IProgressBar {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  detections: Detection[];

  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
}

export default function ProgressBar({
  videoRef,
  playing,
  setPlaying,
  detections,
}: IProgressBar) {
  const [progressInMillis, setProgressInMillis] = useState<number>(0);

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

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video == null) return;

    const newTime = parseFloat(event.target.value);
    setProgressInMillis(newTime);
    video.currentTime = newTime / 1000;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgressInMillis(video.currentTime * 1_000);
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.controlsWrapper}>
      <button onClick={togglePlay} className={styles.playButton}>
        {/*  Alter here the color of the icons  */}
        {playing ? (
          <PauseIcon fill="#FFFFFF" strokeWidth={0} />
        ) : (
          <PlayIcon fill="#4335FF" strokeWidth={0} />
        )}
      </button>

      <div className={styles.progressBarBackground}>
        <div
          style={{
            width:
              (videoRef.current?.currentTime / videoRef.current?.duration) *
              100,
          }}
          className={styles.progressBarSeen}
        ></div>
        {detections.map(
          (detection) => (detection ? <></> : <></>)
          //<div
          //  className={styles.progressBarDetection}
          //  key={detection.type}
          //  style={{
          //    left: ,
          //    width: ,
          //  }}
          //></div>
        )}
      </div>
      <input
        type="range"
        className={styles.progressBar}
        min="0"
        max={videoRef.current?.duration * 1000}
        value={progressInMillis}
        onChange={handleSeek}
      />
    </div>
  );
}
