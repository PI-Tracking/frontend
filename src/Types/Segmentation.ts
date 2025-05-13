// class Segmentation(BaseModel):
//     id: int
//     polygon: List[List[float]]
//     video_id: str
//     timestamp: int

interface Segmentation {
  id: number;
  polygon: Array<Array<number>>;
  video_id: string;
  timestamp: number;
}

export type { Segmentation };
