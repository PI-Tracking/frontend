// types to use the websocket service
// structure of the data received from the websocket

export interface DetectionCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DetectionResult {
  video_id: string;
  timestamp: number;
  class_name: string;
  coordinates: DetectionCoordinates;
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

export function convertBrokerDetectionToAppDetection(
  detection: DetectionResult
): {
  timestamp: number;
  class_name: string;
  confidence: number;
  coordinates: { x: number; y: number }[];
} {
  const coordinates = [
    { x: detection.coordinates.x1, y: detection.coordinates.y1 },
    { x: detection.coordinates.x2, y: detection.coordinates.y1 },
    { x: detection.coordinates.x2, y: detection.coordinates.y2 },
    { x: detection.coordinates.x1, y: detection.coordinates.y2 },
  ];

  return {
    timestamp: detection.timestamp,
    class_name: detection.class_name,
    confidence: 0.7,
    coordinates: coordinates,
  };
}
