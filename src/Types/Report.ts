// TODO: merge with report
import { UUID } from "./Base";
import { User } from "./User.ts";

export interface Report {
  id: UUID;
  name: string;
  creator: User;
  createdAt: Date; // datetime
}
