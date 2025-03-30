import type { double } from "./Base";

export default interface CameraDTO {
  name: string; // size: 0..64
  latitude: double; // range: -90..90
  longitude: double; // range -180..180
}
