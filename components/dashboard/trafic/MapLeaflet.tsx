'use client';

import { useEffect, useRef } from 'react';
import { LivreurTrafic } from '@/types/models';

export default function MapLeaflet({ positions }: { positions: LivreurTrafic[]; }) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null); // pour stocker l'instance Leaflet

    useEffect(() => {
        let map: any;
        let markers: any[] = [];
        const initMap = async () => {
            const L = await import('leaflet');
            if (!mapContainer.current) return;
    
            map = L.map(mapContainer.current, {
                center: [5.345317, -4.024429],
                zoom: 13,
                dragging: true,
                scrollWheelZoom: true,
            });
    
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(map);
        };
    
        initMap();
        mapInstance.current = map;
    
        return () => {
            if (mapInstance.current) mapInstance.current.remove();
        };
    }, []);
    
    useEffect(() => {
        if (!mapInstance.current) return;
        const L = require('leaflet');
    
        // Supprimer les anciens marqueurs
        mapInstance.current.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
                mapInstance.current.removeLayer(layer);
            }
        });
    
        // Ajouter les nouveaux
        positions.forEach(item => {
            L.marker([item.position.latitude, item.position.longitude])
             .addTo(mapInstance.current)
             .bindPopup(`<b>${item.nomComplet || 'Livreur'}</b><br>Statut: ${item.course || 'Disponible'}`);
        });
    
        // Ajuster bounds
        if (positions.length > 0) {
            const bounds = L.latLngBounds(
                positions.map(item => [item.position.latitude, item.position.longitude])
            );
            mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [positions]);    

    return (        
        <div ref={mapContainer} id="leaflet-map" className="w-full h-full" style={{ borderRadius: '5px' }} />
    );
}
