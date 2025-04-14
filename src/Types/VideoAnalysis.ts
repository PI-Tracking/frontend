import { Detection } from "@Types/Detection";
import { UUID } from "./Base";
import { Camera } from "./Camera";

/**
 * analysis_id: UUID;
 * camera: Camera;
 * video: string | File;
 * detections: Detection[];
 * currentTimestamp: number; // To save state of what part of video was being watched
 */
interface VideoAnalysis {
  analysis_id: UUID;
  camera: Camera;
  video: string;
  detections: Detection[];
  currentTimestamp: number; // To save state of what part of video was being watched
}

export type { VideoAnalysis };
