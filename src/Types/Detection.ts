type Point = {
  x: number;
  y: number;
};

/**
 * timestamp: number;
 * class_name: DetectionType;
 * confidence: number;
 * coordinates: Point[];
 * type: DetectionType;
 */

interface Detection {
  timestamp: number;
  className: string;
  class_name: string;
  confidence: number;
  coordinates: Point[];
  videoId: string;
}

export type { Detection };
