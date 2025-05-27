import { Detection } from "@Types/Detection";
import styles from "./styles.module.css";

function normalizeDetection(
  detection: Detection,
  width: number,
  height: number,
  video_width: number,
  video_height: number
): Detection {
  const norm_points = detection.coordinates.map((coords) => ({
    x: (coords.x / video_width) * width,
    y: (coords.y / video_height) * height,
  }));
  return {
    ...detection,
    coordinates: norm_points,
  };
}

interface IDetectionBoxes {
  detections: Detection[];
  width: number;
  height: number;
  currentTimestamp: number;
  video_width: number;
  video_height: number;
}



export default function DetectionBoxes({
  detections,
  width,
  height,
  currentTimestamp,
  video_width,
  video_height,
}: IDetectionBoxes) {
  if (!detections) {
    return;
  }
  const DT = 500;

  const normalizedDetections = detections.map((detection) =>
    normalizeDetection(detection, width, height, video_width, video_height)
  );
  
  let detectionToShow = undefined;
  // Could be optimized with binary search
  // but for now, we just iterate through the detections
  for (const detection of normalizedDetections) {
    const diff = currentTimestamp*1000 - detection.timestamp;
    if (0 <= diff && diff < DT) {
      detectionToShow = detection;
    }
  }
  console.log("detectionToShow", detectionToShow);

  if (detectionToShow === undefined) {
    return <></>;
  }

  return (
    <div
      className={styles.detectionBox}
      style={{
        left: `${detectionToShow.coordinates[0].x}px`,
        top: `${detectionToShow.coordinates[0].y}px`,
        width: `${detectionToShow.coordinates[1].x - detectionToShow.coordinates[0].x}px`,
        height: `${detectionToShow.coordinates[1].y - detectionToShow.coordinates[0].y}px`,
        borderColor: "red",
      }}
    ></div>
  );
}
