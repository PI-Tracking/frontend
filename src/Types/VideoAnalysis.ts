import { Detection } from "@Types/Detection";
import { UUID } from "./Base";
import { Camera } from "./Camera";
import { Segmentation } from "./Segmentation";

/**
 * analysis_id: UUID;
 * video_id: UUID;
 * camera: Camera;
 * video: string | File;
 * detections: Detection[];
 * currentTimestamp: number; // To save state of what part of video was being watched
 */
// TODO: Meter video_id, camera, video e currentTimestamp em evidencia
interface VideoAnalysis {
  analysis_id: UUID;
  video_id: UUID;
  camera: Camera;
  video: string;
  detections: Detection[];
  currentTimestamp: number; // To save state of what part of video was being watched
  segmentations: Segmentation[];
}

export type { VideoAnalysis };
