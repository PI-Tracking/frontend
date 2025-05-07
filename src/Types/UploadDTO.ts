import { UUID } from "./Base";

/**
 * id: UUID;
 * cameraId: UUID;
 * uploadUrl: string;
 * uploaded: boolean;
 */
export interface UploadDTO {
  id: UUID;
  cameraId: UUID;
  uploadUrl: string;
  uploaded: boolean;
}
