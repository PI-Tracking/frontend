// class Segmentation(BaseModel):
//     id: int
//     polygon: List[List[float]]
//     video_id: str
//     timestamp: int

interface Segmentation {
  id: number;
  polygon: Array<Array<number>>;
  videoId: string;
  timestamp: number;
}

export type { Segmentation };
