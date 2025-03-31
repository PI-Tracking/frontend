import type { UUID } from "./Base";

export default interface Camera {
  id: UUID;
  name: string;
  latitude: number;
  longitude: number;
  active: boolean;
  addedAt: string;
}
