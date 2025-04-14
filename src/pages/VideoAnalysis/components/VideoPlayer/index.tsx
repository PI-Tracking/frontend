import { useEffect, useRef, useState } from "react";
import { VideoAnalysis } from "@Types/VideoAnalysis";
import ProgressBar from "./components/ProgressBar";
import DetectionsBoxes from "./components/DetectionsBoxes";
import styles from "./styles.module.css";
import useReportStore from "@hooks/useReportStore";

interface IVideoPlayer {
  videoAnalysis: VideoAnalysis;
  controls: boolean;
}

function VideoPlayer({ videoAnalysis, controls }: IVideoPlayer) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const video = videoAnalysis?.video;
  const detections = videoAnalysis?.detections;
  const { setCurrentTime } = useReportStore();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoAnalysis.currentTimestamp;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  setCurrentTime(videoAnalysis.analysis_id, videoAnalysis.currentTimestamp);

  return (
    <div className={styles.videoContainer}>
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          src={video}
          className={styles.videoElement}
        ></video>

        <DetectionsBoxes
          detections={detections}
          width={videoRef.current?.clientWidth ?? 0}
          height={videoRef.current?.clientHeight ?? 0}
        />
      </div>

      {controls ? (
        <ProgressBar
          videoRef={videoRef}
          detections={detections}
          playing={playing}
          setPlaying={setPlaying}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default VideoPlayer;
