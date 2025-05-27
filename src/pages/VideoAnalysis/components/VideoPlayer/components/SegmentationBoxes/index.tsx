import { Segmentation } from "@Types/Segmentation";
import styles from "./styles.module.css";

function normalizeSegmentation(
  segmentation: Segmentation,
  containerWidth: number,
  containerHeight: number,
  video_width: number,
  video_height: number
): Segmentation {
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

  const normalizedPolygon = segmentation.polygon.map((coords) => [
    (coords[0] / video_width) * displayWidth + offsetX,
    (coords[1] / video_height) * displayHeight + offsetY,
  ]);

  return {
    ...segmentation,
    polygon: normalizedPolygon,
  };
}

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
  const normalizedSegmentations = segmentations.map((segmentation) =>
    normalizeSegmentation(
      segmentation,
      width,
      height,
      video_width,
      video_height
    )
  );

  let segmentationToShow = undefined;
  // Could be optimized with binary search
  for (const segmentation of normalizedSegmentations) {
    const diff = currentTimestamp * 1000 - segmentation.timestamp;
    if (0 <= diff && diff < DT) {
      segmentationToShow = segmentation;
    }
  }

  if (segmentationToShow === undefined) {
    return <></>;
  }

  const pointsString = segmentationToShow.polygon
    .map((coords) => `${coords[0]},${coords[1]}`)
    .join(" ");

  return (
    <div className={styles.segmentationBox}>
      <svg width={width} height={height} className={styles.svgContainer}>
        <polygon
          points={pointsString}
          fill="lightblue"
          fillOpacity=".25"
          stroke="#0000FF"
          strokeOpacity=".75"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
