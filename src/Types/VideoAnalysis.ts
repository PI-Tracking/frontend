import { Camera } from "@Types/Camera";
import { Detection } from "@Types/Detection";
import { UUID } from "./Base";

interface VideoAnalysis {
  id: UUID;
  camera: Camera;
  video: string | File;
  currentTimestamp: number; // To save state of what part of video was being watched
  detections: Detection[];
}

export type { VideoAnalysis };
