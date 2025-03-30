// TODO: merge with report

import { UUID } from "./Base";

interface tempUser {
  badgeId: string;
  email: string;
  username: string;
  active: boolean;
  admin: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
}

export interface ReportBE {
  id: UUID;
  name: string;
  creator: tempUser;
  createdAt: string; // datetime
}
