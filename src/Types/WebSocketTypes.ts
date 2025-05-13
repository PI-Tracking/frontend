// types to use the websocket service
// structure of the data received from the websocket

export interface Point {
  x: number;
  y: number;
}

export interface DetectionResult {
  video_id: string;
  timestamp: number;
  class_name: string;
  confidence: number;
  coordinates: Point[];
}

export interface SegmentationResult {
  video_id: string;
  timestamp: number;
  polygon: number[][];
}

export interface ResultsRequest {
  analysis_id: string;
  detections: DetectionResult[];
  segmentations: SegmentationResult[];
}
