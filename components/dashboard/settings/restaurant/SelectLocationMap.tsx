'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
};

type Props = {
  value: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
};

const defaultCenter = { lat: 5.345317, lng: -4.024429 };

export default function SelectLocationMap({ value, onChange }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onChange({ lat, lng });
    }
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  if (!isLoaded) return <p>Chargement de la carte...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={value ?? defaultCenter}
      zoom={14}
      onClick={handleClick}
      onLoad={onLoad}
    >
      <Marker position={value ?? defaultCenter} />
    </GoogleMap>
  );
}
