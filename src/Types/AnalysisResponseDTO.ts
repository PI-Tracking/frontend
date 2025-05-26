import { Detection } from "./Detection";
import { Segmentation } from "./Segmentation";

export interface AnalysisResponseDTO {
  analysisId: string;
  detections: Detection[];
  segmentations: Segmentation[];
} 