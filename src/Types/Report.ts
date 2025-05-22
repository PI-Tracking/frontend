import { VideoAnalysis } from "@Types/VideoAnalysis";
import { UUID } from "./Base";
import { User } from "./User.ts";

/**
 * id: UUID;
 * name: string;
 * creator: User;
 * uploads: VideoAnalysis[];
 * createdAt: Date; // datetime
 */
export interface Report {
  id: UUID;
  name: string;
  suspectImg: File | undefined;
  creator: User;
  uploads: VideoAnalysis[];
  createdAt: Date; // datetime
}
