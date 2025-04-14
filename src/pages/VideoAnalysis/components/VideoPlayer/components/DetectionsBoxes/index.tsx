import { Detection } from "@Types/Detection";
import styles from "./styles.module.css";

function normalizeDetection(
  detection: Detection,
  width: number,
  height: number
): Detection {
  const norm_points = detection.coordinates.map((coords) => ({
    x: coords.x / width,
    y: coords.y / height,
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
}

export default function DetectionBoxes({
  detections,
  width,
  height,
}: IDetectionBoxes) {
  const normalizedDetections = detections.map((detection) =>
    normalizeDetection(detection, width, height)
  );

  return normalizedDetections.map((detection, index) => (
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
  ));
}
