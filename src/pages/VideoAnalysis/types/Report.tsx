import { Detection } from "./Detection";

interface Camara {
  id: number;
  name: string;
}
// TODO: Refactor
interface VideoAnalysis {
  camera: Camara;
  video: string;
  currentTimestamp: number;
  detections: Detection[];
}

interface Report {
  id: number;
  reportAnalysis: VideoAnalysis[];
}

export type { Report, VideoAnalysis };
