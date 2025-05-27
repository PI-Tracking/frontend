import { Detection } from "@Types/Detection";
import styles from "./styles.module.css";

function normalizeDetection(
  detection: Detection,
  containerWidth: number,
  containerHeight: number,
  video_width: number,
  video_height: number
): Detection {
  // Calculate actual displayed video dimensions
  const videoAspectRatio = video_width / video_height;
  const containerAspectRatio = containerWidth / containerHeight;

  let displayWidth,
    displayHeight,
    offsetX = 0,
    offsetY = 0;

  if (videoAspectRatio > containerAspectRatio) {
    // Video is wider - letterboxed (black bars top/bottom)
    displayWidth = containerWidth;
    displayHeight = containerWidth / videoAspectRatio;
    offsetY = (containerHeight - displayHeight) / 2;
  } else {
    // Video is taller - pillarboxed (black bars left/right)
    displayHeight = containerHeight;
    displayWidth = containerHeight * videoAspectRatio;
    offsetX = (containerWidth - displayWidth) / 2;
  }

  const norm_points = detection.coordinates.map((coords) => ({
    x: (coords.x / video_width) * displayWidth + offsetX,
    y: (coords.y / video_height) * displayHeight + offsetY,
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
    const diff = currentTimestamp * 1000 - detection.timestamp;
    if (0 <= diff && diff < DT) {
      detectionToShow = detection;
    }
  }

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
