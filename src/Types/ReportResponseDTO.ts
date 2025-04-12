import { UUID } from "./Base";

export interface UploadData {
  id: UUID;
  cameraId: UUID;
  uploadUrl: string;
  uploaded: boolean;
}
export interface ReportResponseDTO {
  id: UUID;
  name: string;
  uploads: UploadData[];
}
