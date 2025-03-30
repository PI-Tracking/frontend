import { UUID } from "./Base";

export interface UploadDTO {
  id: UUID;
  cameraId: UUID;
  uploadUrl: string;
  uploaded: boolean;
}
