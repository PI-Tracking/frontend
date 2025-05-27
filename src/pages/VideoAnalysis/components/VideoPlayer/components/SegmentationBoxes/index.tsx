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

  const DT = 500;
  const normalizedSegmentations = segmentations.map((segmentation) => ({
    ...segmentation,
    polygon: segmentation.polygon.map((coords) => ({
      x: (coords[0] / video_width) * width,
      y: (coords[1] / video_height) * height,
    })),
  }));

  let segmentationToShow = undefined;
  // Could be optimized with binary search
  for (const segmentation of normalizedSegmentations) {
    const diff = currentTimestamp*1000 - segmentation.timestamp;
    if (0 <= diff && diff < DT) {
      segmentationToShow = segmentation;
    }
  }
  console.log("segmentationToShow", segmentationToShow);
  if (segmentationToShow === undefined) {
    return <></>;
  }
  
  const pointsString = segmentationToShow.polygon.map(p => `${p.x},${p.y}`).join(' ');
  return (
    <div className={styles.segmentationBox}>
      <svg width={width} height={height} className={styles.svgContainer}>
        <polygon 
          points={pointsString}
          fill="lightblue"
          fill-opacity=".25"
          stroke="#0000FF"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
