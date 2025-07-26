'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrige l'icône par défaut de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

type Props = {
  initialPosition?: { lat: number; lng: number };
  onPositionChange?: (lat: number, lng: number) => void;
};

const MapSelector = ({ initialPosition = { lat: 5.3167, lng: -4.0333 }, onPositionChange }: Props) => {
  const [position, setPosition] = useState(initialPosition);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onPositionChange?.(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <div className="rounded-md overflow-hidden shadow-sm border h-[400px]">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
};

export default MapSelector;
