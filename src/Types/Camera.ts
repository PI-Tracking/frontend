import type { double, UUID } from "./Base";

export interface CameraDTO {
  name: string;
  latitude: double;
  longitude: double;
  active: boolean;
}

export interface Camera {
  id: UUID;
  name: string;
  latitude: double;
  longitude: double;
  active: boolean;
  addedAt: Date;
}
