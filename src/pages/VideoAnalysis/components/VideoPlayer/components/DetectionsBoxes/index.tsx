import { Detection } from "../types/Detection";
import styles from 

interface IDetectionBoxes {
  detections: Detection[];
}

export default function DetectionBoxes({ detections }: IDetectionBoxes) {
  return detections.map((detection, index) => (
    <div
      key={index}
      className={styles.detectionBox}
      style={{
        left: `${detection.Box.points[0][0]}px`,
        top: `${detection.Box.points[0][1]}px`,
        width: `${detection.Box.points[1][0] - detection.Box.points[0][0]}px`,
        height: `${detection.Box.points[1][1] - detection.Box.points[0][1]}px`,
        borderColor: "red",
      }}
    ></div>
  ));
}
