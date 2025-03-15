interface Polygon {
  points: number[][];
}

enum DetectionType {
  SUSPECT,
  GUN,
  HUMA,
}

interface Detection {
  Box: Polygon;
  type: DetectionType;
}

export { DetectionType };
export type { Polygon, Detection };
