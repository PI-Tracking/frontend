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
      videoRef.current.currentTime = videoAnalysis.currentTimestamp ?? 0;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // add button to request reanalisys, instead of always on to improve usability, to not always ask for reanalysis
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("mousedown", (event: MouseEvent) => {
      const rect = video.getBoundingClientRect();

      const offsetX = event.clientX - rect.left; // eslint-disable-line @typescript-eslint/no-unused-vars
      const offsetY = event.clientY - rect.top; // eslint-disable-line @typescript-eslint/no-unused-vars
    });

    return () => {
      video.removeEventListener("", () => {});
    };
  }, []);

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
