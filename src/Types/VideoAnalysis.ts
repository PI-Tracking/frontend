import { Detection } from "@Types/Detection";
import { UUID } from "./Base";

interface VideoAnalysis {
  analysis_id: UUID;
  camera_id: UUID;
  video: string | File;
  detections: Detection[];
  currentTimestamp: number; // To save state of what part of video was being watched
}

export type { VideoAnalysis };
