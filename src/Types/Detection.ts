type Point = {
  x: number;
  y: number;
};

enum DetectionType {
  SUSPECT,
  GUN,
  KNIFE,
}

/**
 * timestamp: number;
 * class_name: DetectionType;
 * confidence: number;
 * coordinates: Point[];
 * type: DetectionType;
 */
interface Detection {
  timestamp: number;
  class_name: DetectionType;
  confidence: number;
  coordinates: Point[];
  type: DetectionType;
}

export { DetectionType };
export type { Detection };
