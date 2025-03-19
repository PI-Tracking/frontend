import { Camera } from "@Types/Camera";
import { Detection } from "@Types/Detection";

interface VideoAnalysis {
  camera: Camera;
  video: string;
  currentTimestamp: number;
  detections: Detection[];
}

export type { VideoAnalysis };
