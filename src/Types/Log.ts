import { UUID } from "./Base";

export enum Action {
  LOGIN = "Login",
  LOGOUT = "Logout",
  UPLOAD_VIDEO = "Upload_video",
  START_DETECTION = "Start_detection",
  ACCESS_LOGS = "Access_logs",
  SELECT_SUSPECT = "Select_Suspect",
}

export interface Log {
  id: string;
  userBadge: string;
  userName: string;
  action: Action;
  logAccessed: UUID;
  timestamp: string; // datetime
}
