'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import 'react-geo-picker/dist/index.css';


// Importation dynamique sans SSR
const GeoPicker = dynamic(() => import('react-geo-picker'), { ssr: false });

interface GeoPickerMapProps {
  defaultLat?: number;
  defaultLng?: number;
  onChange?: (location: { lat: number; lng: number }) => void;
}

const GeoPickerMap: React.FC<GeoPickerMapProps> = ({ defaultLat = 0, defaultLng = 0, onChange }) => {
  const defaultLocation = { lat: defaultLat, lng: defaultLng };

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
      <GeoPicker
        defaultLocation={defaultLocation}
        onChange={onChange}
        className="w-full h-full"
        zoom={13}
        disableScrollZoom={false}
      />
    </div>
  );
};

export default GeoPickerMap;
