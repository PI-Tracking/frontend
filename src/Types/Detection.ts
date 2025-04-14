type Point = {
  x: number;
  y: number;
};

interface Detection {
  timestamp: number;
  class_name: string;
  confidence: number;
  coordinate: Point[];
}

export type { Detection };
