'use client';

import * as React from 'react';
import { Loader } from '@googlemaps/js-api-loader';

type MarkerData = {
    locationId: string;
    name: string;
    postcode: string | null;
    lat: number;
    lng: number;
};

function LocationsMapImpl({
    markers,
    onSelect,
    className,
}: {
    markers: MarkerData[];
    onSelect?: (locationId: string) => void;
    className?: string;
}) {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const mapRef = React.useRef<google.maps.Map | null>(null);
    const infoRef = React.useRef<google.maps.InfoWindow | null>(null);

    React.useEffect(() => {
        let cancelled = false;
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey || !ref.current) return;

        const loader = new Loader({
            apiKey,
            version: 'weekly',
        });

        (async () => {
            const { Map } = await loader.importLibrary('maps') as google.maps.MapsLibrary;
            if (cancelled || !ref.current) return;

            const map = new Map(ref.current, {
                center: { lat: 51.5074, lng: -0.1278 },
                zoom: 6,
                maxZoom: 12,           // 👈 cap zoom-in level (tweak to taste)
                mapTypeControl: false,
                streetViewControl: false,
            });
            mapRef.current = map;
            infoRef.current = new google.maps.InfoWindow();

            renderMarkers();
        })();

        function renderMarkers() {
            if (!mapRef.current) return;

            const bounds = new google.maps.LatLngBounds();
            markers.forEach((m) => {
                if (typeof m.lat !== 'number' || typeof m.lng !== 'number') return;
                const pos = { lat: m.lat, lng: m.lng };
                const marker = new google.maps.Marker({
                    position: pos,
                    map: mapRef.current!,
                    title: m.name,
                });
                bounds.extend(pos);

                marker.addListener('click', () => {
                    infoRef.current?.setContent(`
            <div style="font: 12px sans-serif">
              <div style="font-weight:600">${m.name}</div>
              <div style="color:#6b7280">${m.postcode ?? ''}</div>
            </div>
          `);
                    infoRef.current?.open({ anchor: marker, map: mapRef.current! });
                });
            });

            if (!bounds.isEmpty()) {
                mapRef.current!.fitBounds(bounds, { top: 48, bottom: 48, left: 48, right: 48 });
              }
        }

        return () => {
            cancelled = true;
        };
    }, [markers, onSelect]);

    return <div ref={ref} className={className ?? 'h-[420px] w-full rounded-md border'} />;
}

const LocationsMap = React.memo(LocationsMapImpl);

export default LocationsMap;