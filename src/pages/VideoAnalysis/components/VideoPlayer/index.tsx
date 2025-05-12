import { MouseEvent, useEffect, useRef, useState } from "react";
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

  // Set timestamp of video to the current video
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }
    if (videoAnalysis.currentTimestamp) {
      videoElement.currentTime = videoAnalysis.currentTimestamp;
    }
  }, [videoRef, videoAnalysis]);

  const handleClick = (event: MouseEvent<HTMLVideoElement>) => {
    const videoElement = videoRef.current!;
    if (!extractingSuspect) return;

    const rect = videoElement.getBoundingClientRect();
    const scale_width = videoElement.videoWidth / rect.width;
    const scale_height = videoElement.videoHeight / rect.height;
    const x = (event.clientX - rect.left) * scale_width;
    const y = (event.clientY - rect.top) * scale_height;

    requestNewReanalysis(
      Math.trunc(x),
      Math.trunc(y),
      videoElement.currentTime
    );
  };

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
          onClick={handleClick}
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
