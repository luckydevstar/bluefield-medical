'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type Location = { id: string; name: string; postcode: string; lat: number; lng: number };

function FlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, 10, { duration: 0.7 }); }, [center, map]);
  return null;
}

export default function LeafletMap({
  center,
  locations,
  onSelect,
}: {
  center: [number, number]; // [lng, lat]
  locations: Location[];
  onSelect: (loc: Location) => void;
}) {
  return (
    <MapContainer
      center={[center[1], center[0]]}
      zoom={8}
      scrollWheelZoom
      className="h-full w-full"
    >
      <FlyTo center={center} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {locations.map((l) => (
        <Marker key={l.id} position={[l.lat, l.lng]} eventHandlers={{ click: () => onSelect(l) }}>
          <Popup>
            <div className="text-sm">
              <div className="font-medium">{l.name}</div>
              <div className="opacity-70">{l.postcode}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
