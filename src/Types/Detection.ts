type Point = {
  x: number;
  y: number;
};

enum DetectionType {
  SUSPECT,
  GUN,
  KNIFE,
}

interface Detection {
  timestamp: number;
  class_name: DetectionType;
  confidence: number;
  coordinate: Point[];
}

export { DetectionType };
export type { Detection };
