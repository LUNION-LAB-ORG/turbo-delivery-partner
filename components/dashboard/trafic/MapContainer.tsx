'use client';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { LivreurDisponible } from '@/types/models';
import createUrlFile from '@/utils/createUrlFile';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { darkMapStyle } from '@/data';
import { motion } from 'framer-motion';
import React from 'react';
import { X } from 'lucide-react';
import { InfoWindowF } from '@react-google-maps/api';

const defaultCenter = {
  lat: 5.345317,
  lng: -4.024429,
};

const defaultZoom = 10;
const iconCache = new Map<string, string>();

const DEFAULT_AVATAR_ICON = '/assets/images/icon.png'; // Chemin vers une icône/avatar par défaut

// Fonction pour créer une icône marker personnalisée avec image arrondie en haut, et nom en dessous
const createMarkerIcon = async (
  imageUrl: string,
  name: string,
  isDark: boolean
): Promise<string> => {
  const cacheKey = `${imageUrl}-${name}-${isDark}`;
  if (iconCache.has(cacheKey)) {
    return Promise.resolve(iconCache.get(cacheKey)!);
  }

  const canvas = document.createElement('canvas');
  const size = 15; // largeur
  const height = 25; // hauteur plus grande pour la pointe
  const imgSize = 20;
  const textHeight = 20;

  canvas.width = size;
  canvas.height = height + textHeight;

  const ctx = canvas.getContext('2d')!;

  const centerX = size / 2;
  const centerY = imgSize / 2 + 10;

  // Dessiner la forme goutte rouge de fond
  ctx.fillStyle = '#EF4444'; // rouge (ou autre teinte rouge)
  ctx.beginPath();
  ctx.moveTo(centerX, height); // pointe basse
  ctx.quadraticCurveTo(centerX - 35, height - 40, centerX - 30, 25); // bord gauche arrondi
  ctx.arc(centerX, 25, 30, Math.PI, 0, false); // arc de cercle haut
  ctx.quadraticCurveTo(centerX + 30, 25, centerX + 30, height - 40); // bord droit
  ctx.closePath();
  ctx.fill();

  // Cercle blanc/gris clair derrière l'avatar (comme dans ton code initial)
  ctx.fillStyle = isDark ? '#374151' : '#FFFFFF';
  ctx.beginPath();
  ctx.arc(centerX, centerY, imgSize / 2 + 5, 0, Math.PI * 2);
  ctx.fill();

  // Bordure verte autour de l'avatar
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, centerY, imgSize / 2 + 3, 0, Math.PI * 2);
  ctx.stroke();

  // Clip circulaire pour avatar
  ctx.beginPath();
  ctx.arc(centerX, centerY, imgSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  return new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      ctx.drawImage(img, centerX - imgSize / 2, centerY - imgSize / 2, imgSize, imgSize);

      // Texte sous la goutte, centré
      ctx.font = '600 12px Inter';
      ctx.textAlign = 'center';
      ctx.fillStyle = isDark ? '#E5E7EB' : '#111827';
      ctx.fillText(name, centerX, height + textHeight - 6);

      const dataUrl = canvas.toDataURL();
      iconCache.set(cacheKey, dataUrl);
      resolve(dataUrl);
    };

    img.onerror = () => {
      resolve(DEFAULT_AVATAR_ICON);
    };
  });
};
 

type MapContainerProps = {
  couriers: LivreurDisponible[];
  selectedCourierId?: string | null;
  onMarkerClick?: (courierId: string | null) => void; // Accepte null
};

export default function MapContainer({
  couriers,
  selectedCourierId,
  onMarkerClick,
}: MapContainerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const containerStyle = {
    width: '100%',
    height: typeof window !== 'undefined' ? `${window.innerHeight - 180}px` : '600px',
  };

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);


  useEffect(() => {
    if (map && selectedCourierId) {
      const selectedCourier = couriers.find((c) => c.livreurId === selectedCourierId);
      if (selectedCourier && selectedCourier.position) {
        map.panTo({
          lat: selectedCourier.position.latitude,
          lng: selectedCourier.position.longitude,
        });
        if ((map.getZoom() ?? 0) < 17) {
          map.setZoom(17);
        }
      }
    }
  }, [selectedCourierId, map, couriers]);

  const courierMarkers = useMemo(() => {
    return couriers.map((courier) => {
      const iconPromise = createMarkerIcon(
        createUrlFile(courier.avatarUrl, 'backend'),
        courier.nomComplet,
        isDark
      );
  
      return (
        <MarkerAsync
          key={courier.livreurId}
          position={{
            lat: courier.position.latitude,
            lng: courier.position.longitude,
          }}
          iconPromise={iconPromise}
          onClick={() => onMarkerClick?.(courier.livreurId)}
          courier={courier}
          isSelected={selectedCourierId === courier.livreurId}
          map={map || undefined}
          animation={selectedCourierId === courier.livreurId ? google.maps.Animation.BOUNCE : undefined}
        />
      );
    });
  }, [couriers, isDark, selectedCourierId, onMarkerClick]);

  if (loadError) return <div className="p-4 text-red-500 dark:text-red-400">Erreur de chargement de la carte</div>;
  if (!isLoaded) return <div className="p-4 dark:text-gray-300">Chargement de la carte...</div>;

  return (
    <div className="rounded-xl shadow-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={defaultZoom}
        center={
          couriers[0]?.position
            ? { lat: couriers[0].position.latitude, lng: couriers[0].position.longitude }
            : defaultCenter
        }
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: isDark ? darkMapStyle : undefined,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {courierMarkers}
      </GoogleMap>

      {selectedCourierId && (
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-64 overflow-hidden"
          >
            {/* Contenu du pop-up */}
            <div className="bg-primary p-4 relative">
              <button 
                onClick={() => onMarkerClick?.(null)} // Passe null pour fermer
                className="absolute top-2 right-2 text-white hover:bg-white/10 rounded-full p-1"
              >
                <X size={16} />
              </button>
              <h3 className="text-white font-bold text-lg">
                {couriers.find(c => c.livreurId === selectedCourierId)?.nomComplet}
              </h3>
            </div>
            
            {/* Corps du pop-up */}
            <div className="p-4 space-y-2">              
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📱</span>
                <span className="text-sm">
                  {couriers.find(c => c.livreurId === selectedCourierId)?.telephone}
                </span>
              </div>              
              <div className="pt-2">
                <a 
                  href={`https://www.google.com/maps?q=${
                    couriers.find(c => c.livreurId === selectedCourierId)?.position?.latitude
                  },${
                    couriers.find(c => c.livreurId === selectedCourierId)?.position?.longitude
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </motion.div>
      </div>
      )}
</div>
  );
}

type MarkerAsyncProps = {
  iconPromise: Promise<string>;
  position: google.maps.LatLngLiteral;
  onClick?: () => void;
  animation?: google.maps.Animation;
  courier: LivreurDisponible; // Ajoutez cette prop
  isSelected?: boolean;
  map?: google.maps.Map; // Ajoutez cette ligne
};

const MarkerAsync = ({ 
  iconPromise, 
  onClick, 
  courier,
  isSelected,
  map,
  ...props 
}: MarkerAsyncProps) => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    let isMounted = true;
    iconPromise.then((url) => {
      if (isMounted) setIconUrl(url || DEFAULT_AVATAR_ICON);
    });
    return () => { isMounted = false; };
  }, [iconPromise]);

  useEffect(() => {
    if (!isSelected || !iconUrl) return;
    
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-2 bg-white rounded shadow-lg">
          <h3 class="font-bold">${courier.nomComplet}</h3>
          <p>${courier.telephone}</p>
        </div>
      `,
      disableAutoPan: true
    });

    setInfoWindow(infoWindow);

    return () => {
      if (infoWindow) {
        infoWindow.close();
      }
    };
  }, [isSelected, iconUrl, courier]);

  const handleClick = () => {
    onClick?.();
  };

  if (!iconUrl) return null;

  return (
    <>
      <Marker
        {...props}
        onClick={handleClick}
        icon={{
          url: iconUrl,
          scaledSize: new window.google.maps.Size(70, 120),
          anchor: new google.maps.Point(20, 50),
        }}
      />
      {isSelected && infoWindow && (
        <InfoWindowF
          position={props.position}
          onCloseClick={() => onClick?.()}
          options={{
            pixelOffset: new window.google.maps.Size(0, -40)
          }}
        >
          <div className="p-2 bg-white rounded shadow-lg">
            <h3 className="font-bold">{courier.nomComplet}</h3>
            <p>{courier.telephone}</p>
          </div>
        </InfoWindowF>
      )}
    </>
  );
};
