import { Report } from "./Report";

interface Authority {
  authority: string;
}

/**
 *
 * badgeId: string;
 * email: string;
 * username: string;
 * active: boolean;
 * reports: Report[];
 * admin: boolean;
 * credentialsNonExpired: boolean;
 * accountNonExpired: boolean;
 * accountNonLocked: boolean;
 * authorities: Authority[];
 * enabled: boolean;
 */
export interface User {
  badgeId: string;
  email: string;
  username: string;
  active: boolean;
  reports: Report[];
  admin: boolean;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  authorities: Authority[];
  enabled: boolean;
}
