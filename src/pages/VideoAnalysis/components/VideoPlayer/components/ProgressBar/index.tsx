import { Dispatch, SetStateAction, useEffect, MouseEvent } from "react";
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

  const handleSeek = (event: MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (video == null) return;

    const offset = event.nativeEvent.offsetX;
    const divWidth = event.currentTarget.offsetWidth;

    const newTime = (offset / divWidth) * video.duration;
    video.currentTime = newTime;
  };

  const updateProgress = (newProgress?: number) => {
    const video = videoRef.current;
    if (!video) return;

    if (newProgress == undefined) {
      newProgress = video.currentTime / video.duration;
    }

    // Update css progress variables
    document.documentElement.style.setProperty(
      "--progress-position",
      `${Math.ceil(newProgress * 100) / 100}`
    );
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("timeupdate", () => updateProgress());
    return () => {
      video.removeEventListener("timeupdate", () => updateProgress());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (time: number) => {
    const minutes = Math.ceil(time / 60);
    const seconds = time - minutes * 60;
    return `${minutes}:${seconds}`;
  };

  return (
    <div className={styles.controlsWrapper}>
      <button onClick={togglePlay} className={styles.playButton}>
        {playing ? (
          <i className="fa fa-pause"></i>
        ) : (
          <i className="fa fa-play"></i>
        )}
      </button>
      <span>
        {videoRef.current
          ? formatTime(videoRef.current.currentTime) +
            "/" +
            formatTime(videoRef.current.duration)
          : "00:00 / 00:00"}
      </span>

      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          onClick={handleSeek}
          onTouchMove={() => {
            return;
          }}
        >
          <div className={styles.progressBarBubble}></div>
          {detections.map((detection) => (detection ? <></> : <></>))}
        </div>
      </div>
    </div>
  );
}
