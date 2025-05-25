import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";


L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
});

type props = {
  positions: [number, number][]
}

export default function Routing({ positions }: props) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    L.Routing.control({
      waypoints: positions.map(([lat, lng]) => L.latLng(lat, lng)),
      routeWhileDragging: false,
      show: false
    }).addTo(map);

    return;
  }, [map, positions]);

  return null;
}
