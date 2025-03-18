import { useEffect, useRef, useState } from "react";
import styles from "./Player.module.css";
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

  return (
    <div className={styles.videoContainer}>
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          src={video}
          className={styles.videoElement}
        ></video>

        <DetectionsBoxes detections={detections} />
        ))}
      </div>

      <div className={styles.controls}>
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
