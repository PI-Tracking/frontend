import { VideoAnalysis } from "@Types/VideoAnalysis";
import { UUID } from "./Base";
import { User } from "./User.ts";

export interface Report {
  id: UUID;
  name: string;
  creator: User;
  uploads: VideoAnalysis[];
  createdAt: Date; // datetime
}
