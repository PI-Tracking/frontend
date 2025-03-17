import type { double, UUID } from "./Base";

export default interface Camera {
  id: UUID;
  name: string;
  latitude: double;
  longitude: double;
  active: boolean;
  addedAt: string;
}
