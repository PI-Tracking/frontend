import { UUID } from "./Base";

export interface ReportResponseDTO {
  id: UUID;
  name: string;
  uploads: string; // TODO: meter da maneira correta depos do pull request das analises,
}
