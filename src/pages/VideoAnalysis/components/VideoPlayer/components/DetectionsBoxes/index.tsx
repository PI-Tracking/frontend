import { Detection } from "@Types/Detection";
import styles from "./styles.module.css";

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

interface IDetectionBoxes {
  detections: Detection[];
}

export default function DetectionBoxes({ detections }: IDetectionBoxes) {
  return detections.map((detection, index) => (
    <div
      key={index}
      className={styles.detectionBox}
      style={{
        left: `${detection.detection_box.points[0][0]}px`,
        top: `${detection.detection_box.points[0][1]}px`,
        width: `${detection.detection_box.points[1][0] - detection.detection_box.points[0][0]}px`,
        height: `${detection.detection_box.points[1][1] - detection.detection_box.points[0][1]}px`,
        borderColor: "red",
      }}
    ></div>
  ));
}
