import { UUID } from "./Base";

export interface CameraTimeIntervalDTO {
  cameraId: UUID;
  initialTimestamp: number;
  finalTimestamp: number;
}
