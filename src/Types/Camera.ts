import type { UUID } from "./Base";

export interface Camera {
  id: UUID;
  name: string;
  latitude: number;
  longitude: number;
  active: boolean;
  addedAt: string;
}
