import { UUID } from "./Base";

export interface NewReportDTO {
  name: string;
  cameras: UUID[];
  hasSuspect: boolean;
}
