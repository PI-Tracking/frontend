import { useCallback, useEffect, useRef, useState } from "react";
import { VideoAnalysis } from "@Types/VideoAnalysis";
import ProgressBar from "./components/ProgressBar";
import DetectionsBoxes from "./components/DetectionsBoxes";
import styles from "./styles.module.css";
import useReportStore from "@hooks/useReportStore";

interface IVideoPlayer {
  videoAnalysis: VideoAnalysis;
  controls: boolean;
  extractingSuspect: boolean;
  requestNewReanalysis: (x: number, y: number, timestamp: number) => void;
}

function VideoPlayer({
  videoAnalysis,
  controls,
  extractingSuspect,
  requestNewReanalysis,
}: IVideoPlayer) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const video = videoAnalysis?.video;
  const detections = videoAnalysis?.detections;
  const { setCurrentTime } = useReportStore();

  const handleClick = useCallback(
    (event: MouseEvent) => {
      const videoElement = videoRef.current!;

      if (!extractingSuspect) return;

      const rect = videoElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      requestNewReanalysis(x, y, videoElement.currentTime);
    },
    [extractingSuspect, videoRef, requestNewReanalysis]
  );

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }
    if (videoAnalysis.currentTimestamp) {
      videoElement.currentTime = videoAnalysis.currentTimestamp;
    }
    videoElement.addEventListener("click", handleClick);
    return () => {
      videoElement.removeEventListener("click", handleClick);
    };
  }, [videoAnalysis, videoRef]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateVideoCurrentTS = (time: number) => {
    if (videoAnalysis && videoAnalysis.video_id) {
      setCurrentTime(videoAnalysis.video_id, time);
    } else {
      console.warn(
        "Cannot update time: videoAnalysis or video_id is undefined"
      );
    }
  };

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
          setCurrentTime={updateVideoCurrentTS}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default VideoPlayer;
