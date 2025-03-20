import {
  Dispatch,
  SetStateAction,
  //ChangeEvent,
  useState,
  useEffect,
} from "react";
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

  //const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
  //  const video = videoRef.current;
  //  if (video == null) return;
  //
  //  const newTime = parseFloat(event.target.value);
  //  setProgressInMillis(newTime);
  //  video.currentTime = newTime / 1000;
  //};

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
        {playing ? (
          <i className="fa fa-pause"></i>
        ) : (
          <i className="fa fa-play"></i>
        )}
      </button>

      <div className={styles.progressBarBackground}>
        <div
          style={{
            width: progressInMillis / videoRef.current?.duration / 10 + "%",
          }}
          className={styles.progressBarSeen}
        ></div>
        <div
          //style={{
          //  left:
          //}}
          className={styles.progressBarBubble}
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
    </div>
  );
}
