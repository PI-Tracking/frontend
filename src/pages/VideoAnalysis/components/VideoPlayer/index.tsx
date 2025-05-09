import { useEffect, useRef, useState } from "react";
import { VideoAnalysis } from "@Types/VideoAnalysis";
import ProgressBar from "./components/ProgressBar";
import DetectionsBoxes from "./components/DetectionsBoxes";
import styles from "./styles.module.css";
import useReportStore from "@hooks/useReportStore";

interface IVideoPlayer {
  videoAnalysis: VideoAnalysis;
  controls: boolean;
  extractingSuspect: boolean;
  requestReanalysis: (x: number, y: number, timestamp: number) => void;
}

function VideoPlayer({
  videoAnalysis,
  controls,
  extractingSuspect,
  requestReanalysis,
}: IVideoPlayer) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const video = videoAnalysis?.video;
  const detections = videoAnalysis?.detections;
  const { setCurrentTime } = useReportStore();

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    videoElement.currentTime = videoAnalysis.currentTimestamp ?? 0;

    const handleClick = (event: MouseEvent) => {
      if (!videoElement || !extractingSuspect) {
        return;
      }

      const rect = videoElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (extractingSuspect) {
        requestReanalysis(x, y, videoElement.currentTime);
      }
    };

    videoElement.addEventListener("click", handleClick);
    return () => {
      videoElement.removeEventListener("click", handleClick);
    };
  }, [videoRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.videoContainer}>
      <div className={styles.videoWrapper}>
        <video
          src={video}
          ref={videoRef}
          className={styles.videoElement}
        ></video>

        <DetectionsBoxes
          detections={detections}
          width={videoRef.current?.clientWidth ?? 0}
          height={videoRef.current?.clientHeight ?? 0}
          currentTimestamp={videoRef.current?.currentTime || 0}
          video_width={videoRef.current?.videoWidth ?? 0}
          video_height={videoRef.current?.videoHeight ?? 0}
        />
      </div>

      {controls ? (
        <ProgressBar
          videoRef={videoRef}
          detections={detections}
          playing={playing}
          setPlaying={setPlaying}
          setCurrentTime={(time: number) =>
            setCurrentTime(videoAnalysis.video_id, time)
          }
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default VideoPlayer;
