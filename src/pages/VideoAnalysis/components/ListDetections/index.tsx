import { Detection } from "@Types/Detection";
import styles from "./ListDetections.module.css";

interface IListDetections {
  detections: Detection[];
}

function ListDetections(props: IListDetections) {
  if (!props.detections) {
    return <></>;
  }
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const str_seconds = Math.floor(time - minutes * 60)
      .toString()
      .padStart(2, "0");
    const str_minutes = minutes.toString().padStart(2, "0");

    return `${str_minutes}:${str_seconds}`;
  };

  return (
    <div className={styles.list}>
      {props.detections.map((detection) => (
        <div className={styles.listElement}>
          {detection.class_name} - {formatTime(detection.timestamp / 1000)}
        </div>
      ))}
    </div>
  );
}

export default ListDetections;
