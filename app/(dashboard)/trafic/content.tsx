'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import MapContainer from '@/components/dashboard/trafic/MapContainer';
import { LivreurDisponible } from '@/types/models';
import useRealTime from './useRealTime';
import SearchBar from './searchBar';
import { LivreurTimeline } from '@/components/dashboard/trafic/LivreurTimeline';
import { LivreursListBottom } from '@/components/dashboard/trafic/LivreursListBottom';
import { Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LayoutDashboard, MapPin, RefreshCw } from 'lucide-react';
import { 
    dispatcherLivreursAbidjanPondere, 
    simulerDeplacementLivreur,
    formaterPositionLivreur,
    LivreurAvecPosition 
} from './abidjanDispatching';
import { getTraficLivreurs } from '@/src/actions/trafic.actions';
import { Data } from '@react-google-maps/api';

interface ContentProps {
    data: LivreurDisponible[];
}

export default function Content({ data }: ContentProps) {
    const [selectedCourierId, setSelectedCourierId] = useState<string | null>(null);
    const [livreursAvecPosition, setLivreursAvecPosition] = useState<LivreurAvecPosition[]>([]);
    const [openDashboard, setOpenDashboard] = useState<boolean>(false);
    const [simulationActive, setSimulationActive] = useState<boolean>(false);
    const [traficLivreurs, setTraficLivreurs] = useState<LivreurAvecPosition[]>([]);

    const { isConnected } = useRealTime({ data: livreursAvecPosition, setData: setLivreursAvecPosition });
    useEffect(() => {
        (async () => {
            const positions = (await getTraficLivreurs()).filter(
                (livreur: LivreurAvecPosition) =>
                  livreur.position && !(livreur.position.latitude === 0 && livreur.position.longitude === 0)
            );              
            setTraficLivreurs(positions ?? [])
        })();
    }, []);

    const livreursRestaurantAvecPosition = useMemo(() => {
        return traficLivreurs.filter((livreurRestau: LivreurDisponible) =>
            data.some((livreurActif: LivreurAvecPosition) =>
              livreurActif.livreurId === livreurRestau.livreurId
            )
        );
    }, [data, traficLivreurs]);
      
    const livreursRestaurantSansPosition = useMemo(() => {
        return data.filter((livreurRestau: LivreurDisponible) => !traficLivreurs.some((livreurActif: LivreurAvecPosition) => livreurActif.livreurId === livreurRestau.livreurId ) );
    }, [data, traficLivreurs]);
    

    // Simulation de mouvement des livreurs
    useEffect(() => {
        if (!simulationActive) return;

        const interval = setInterval(() => {
            setLivreursAvecPosition(prev => 
                prev.map(livreur => simulerDeplacementLivreur(livreur))
            );
        }, 5000); // Mise à jour toutes les 5 secondes

        return () => clearInterval(interval);
    }, [simulationActive]);

    // Memoisation des livreurs avec position valide
    const livreursValides = useMemo(() => {
        return livreursAvecPosition.filter(livreur => 
            livreur.position?.latitude != null && 
            livreur.position?.longitude != null
        );
    }, [livreursAvecPosition]);    

    // Callbacks
    const handleCourierSelect = useCallback((courierId: string | null) => {
        setSelectedCourierId(courierId);
    }, []);

    const toggleDashboard = useCallback(() => {
        setOpenDashboard(prev => !prev);
    }, []);

    const toggleSimulation = useCallback(() => {
        setSimulationActive(prev => !prev);
    }, []);

    // Statistiques générales
    const stats = useMemo(() => {
        const avecPosition = data.filter((livreurRestau: LivreurDisponible) =>
          traficLivreurs.some((livreurActif: LivreurAvecPosition) =>
            livreurActif.livreurId === livreurRestau.livreurId
          )
        ).length;
      
        const total = data.length;
        const sansPosition = total - avecPosition;
      
        return { total, avecPosition, sansPosition };
    }, [data, traficLivreurs]);

    // Indicateur de connexion avec stats
    const ConnectionIndicator = () => (
        <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
                <div className="relative flex h-3 w-3">
                    <span
                        className={`absolute -top-[3px] -left-[3px] inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                            isConnected ? 'bg-green-500/50' : 'bg-red-500/50'
                        }`}
                    />
                    <span 
                        className={`relative inline-flex h-[6px] w-[6px] rounded-full ${ isConnected ? 'bg-green-500' : 'bg-red-500' }`} 
                    />
                </div>
                <span className="text-sm font-medium">
                    {isConnected ? 'Connecté(s)' : 'Déconnecté(s)'} • {stats.avecPosition}/{stats.total} livreurs
                </span>
            </div>
            
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="flat"
                    color={simulationActive ? "success" : "default"}
                    startContent={<MapPin size={16} />}
                    onClick={toggleSimulation}
                >
                    {simulationActive ? "Simulation ON" : "Simulation OFF"}
                </Button>
            </div>
        </div>
    );

    // Panel du dashboard avec stats communes
    const DashboardPanel = () => (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full"
        >
            <Card className="w-full max-w-full sm:max-w-6xl mx-auto rounded-t-2xl">
                <CardHeader className="flex justify-center items-center pb-2">
                    <Button 
                        size="sm" 
                        onClick={toggleDashboard}
                        isIconOnly 
                        startContent={<ChevronDown />} 
                        variant="light" 
                    />
                </CardHeader>
                <CardBody className="space-y-6 px-4 sm:px-6 pb-6">
                    {/* Statistiques générales */}
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                            <div className="font-semibold text-xl">{stats.total}</div>
                            <div className="text-gray-500">Total</div>
                        </div>
                        <div>
                            <div className="font-semibold text-xl text-green-600">{stats.avecPosition}</div>
                            <div className="text-gray-500">Connecté(s)</div>
                        </div>
                        <div>
                            <div className="font-semibold text-xl text-red-600">{stats.sansPosition}</div>
                            <div className="text-gray-500">Non Connecté(s)</div>
                        </div>
                    </div>
                    
                    {/* Détails du livreur sélectionné */}
                    {selectedCourierId && (
                        <div className="border-t pt-4">
                            {(() => {
                                const livreurSelectionne = livreursAvecPosition.find(l => l.livreurId === selectedCourierId);
                                if (!livreurSelectionne) return null;
                                
                                return (
                                    <div className="text-sm space-y-1">
                                        <h4 className="font-medium">
                                            {livreurSelectionne.nomComplet}
                                        </h4>
                                        <p className="text-gray-600">
                                            📍 {formaterPositionLivreur(livreurSelectionne)}
                                        </p>
                                        <p className="text-gray-500">
                                            📱 {livreurSelectionne.telephone}
                                        </p>
                                    </div>
                                );
                            })()}
                        </div>
                    )}                    
                    <LivreurTimeline  
                        livreurs={livreursRestaurantAvecPosition}  
                        handleCourierSelect={handleCourierSelect}  
                    />  

                    <LivreursListBottom  
                        livreurs={livreursRestaurantSansPosition}  
                        handleCourierSelect={handleCourierSelect}  
                    />  
                </CardBody>
            </Card>
        </motion.div>
    );

    return (
        <div className="w-full h-full pb-10 flex flex-1 flex-col gap-4">
            {/* En-tête avec contrôles */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <ConnectionIndicator />                
                <SearchBar 
                    coursiers={livreursValides} 
                    handleCourierSelect={handleCourierSelect} 
                />
            </div>

            {/* Conteneur de la carte */}
            <div className="relative flex-1 pb-20">
                <MapContainer
                    couriers={livreursRestaurantAvecPosition}
                    selectedCourierId={selectedCourierId}
                    onMarkerClick={handleCourierSelect}
                />

                {/* Dashboard flottant */}
                <div className="absolute bottom-0 sm:-bottom-8 w-full z-10">
                    <AnimatePresence mode="wait">
                    {!openDashboard ? (
                        <motion.div
                        key="open-button"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full bg-background rounded-t-3xl p-2 flex justify-center"
                        >
                        <Button 
                            onClick={toggleDashboard}
                            isIconOnly 
                            startContent={<LayoutDashboard />}
                            variant="bordered" 
                            color="primary"
                            size="sm"
                        />
                        </motion.div>
                    ) : (
                        <div className="absolute bottom-0 w-full z-10 px-2 sm:px-4">
                            <DashboardPanel />
                        </div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}