import { useEffect, useRef, useState } from "react";
import styles from "./Player.module.css";
import { PauseIcon, PlayIcon } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { VideoAnalysis } from "../types/Report";

//function normalizeDetection(
//  detection: Detection,
//  width: number,
//  height: number
//): Detection {
//  const norm_points = detection.Box.points.map((coords) => [
//    coords[0] / width,
//    coords[0] / height,
//  ]);
//  return {
//    ...detection,
//    Box: {
//      points: norm_points,
//    },
//  };
//}

interface IVideoPlayer {
  videoAnalysis: VideoAnalysis;
}
function VideoPlayer({ videoAnalysis }: IVideoPlayer) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);

  const video = videoAnalysis?.video;
  const detections = videoAnalysis?.detections;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

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
    <div className={styles.videoContainer}>
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          src={video}
          className={styles.videoElement}
        ></video>

        {detections.map((detection, index) => (
          <div
            key={index}
            className={styles.detectionBox}
            style={{
              left: `${detection.Box.points[0][0]}px`,
              top: `${detection.Box.points[0][1]}px`,
              width: `${detection.Box.points[1][0] - detection.Box.points[0][0]}px`,
              height: `${detection.Box.points[1][1] - detection.Box.points[0][1]}px`,
              borderColor: "red",
            }}
          ></div>
        ))}
      </div>

      <div className={styles.controls}>
        <button onClick={togglePlay} className={styles.playButton}>
          {/*  Alter here the color of the icons  */}
          {playing ? (
            <PauseIcon fill="#FFFFFF" strokeWidth={0} />
          ) : (
            <PlayIcon fill="#4335FF" strokeWidth={0} />
          )}
        </button>

        <ProgressBar
          videoRef={videoRef}
          progress={progress}
          setProgress={setProgress}
          detections={detections}
        />
      </div>
    </div>
  );
}

export default VideoPlayer;
