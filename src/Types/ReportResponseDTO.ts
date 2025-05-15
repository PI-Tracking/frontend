import { UUID } from "./Base";
import { User } from "./User";

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
  creator: User;
}
