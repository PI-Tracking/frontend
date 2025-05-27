import { Segmentation } from "@Types/Segmentation";
import styles from "./styles.module.css";

interface ISegmentationBoxes {
  segmentations: Segmentation[];
  width: number;
  height: number;
  currentTimestamp: number;
  video_width: number;
  video_height: number;
}

export default function SegmentationBoxes({
  segmentations,
  width,
  height,
  currentTimestamp,
  video_width,
  video_height,
}: ISegmentationBoxes) {
  if (!segmentations) {
    return;
  }

  const DT = 200;

  const normalizedSegmentations = segmentations.map((segmentation) => ({
    ...segmentation,
    polygon: segmentation.polygon.map((coords) => ({
      x: (coords[0] / video_width) * width,
      y: (coords[1] / video_height) * height,
    })),
  }));

  let segmentationToShow = undefined;
  for (const segmentation of normalizedSegmentations) {
    const diff = currentTimestamp * 1000 - segmentation.timestamp;
    if (0 < diff && diff < DT) {
      segmentationToShow = segmentation;
    }
  }

  if (segmentationToShow === undefined) {
    return <></>;
  }

  return (
    <div
      className={styles.detectionBox}
      style={{
        left: `${segmentationToShow.coordinates[0].x}px`,
        top: `${segmentationToShow.coordinates[0].y}px`,
        width: `${segmentationToShow.coordinates[1].x - segmentationToShow.coordinates[0].x}px`,
        height: `${segmentationToShow.coordinates[1].y - segmentationToShow.coordinates[0].y}px`,
        borderColor: "red",
      }}
    ></div>
  );
}
