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

  return normalizedSegmentations.map((segmentation, index) => {
    if (Math.abs(segmentation.timestamp - currentTimestamp * 1000) < DT) {
      return (
        <div
          key={index}
          className={styles.segmentationBox}
          style={{
            left: `${Math.min(...segmentation.polygon.map((p) => p.x))}px`,
            top: `${Math.min(...segmentation.polygon.map((p) => p.y))}px`,
            width: `${Math.max(...segmentation.polygon.map((p) => p.x)) - Math.min(...segmentation.polygon.map((p) => p.x))}px`,
            height: `${Math.max(...segmentation.polygon.map((p) => p.y)) - Math.min(...segmentation.polygon.map((p) => p.y))}px`,
            borderColor: "blue",
          }}
        >
          {segmentation.id}
        </div>
      );
    }
    return null;
  });
}
