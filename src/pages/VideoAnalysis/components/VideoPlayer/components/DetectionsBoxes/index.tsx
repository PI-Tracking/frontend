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

  const DT = 200;

  const normalizedDetections = detections.map((detection) =>
    normalizeDetection(detection, width, height, video_width, video_height)
  );

  return normalizedDetections.map((detection, index) => {
    if (Math.abs(detection.timestamp - currentTimestamp * 1000) < DT) {
      return (
        <div
          key={index}
          className={styles.detectionBox}
          style={{
            left: `${detection.coordinates[0].x}px`,
            top: `${detection.coordinates[0].y}px`,
            width: `${detection.coordinates[1].x - detection.coordinates[0].x}px`,
            height: `${detection.coordinates[1].y - detection.coordinates[0].y}px`,
            borderColor: "red",
          }}
        ></div>
      );
    }
  });
}
