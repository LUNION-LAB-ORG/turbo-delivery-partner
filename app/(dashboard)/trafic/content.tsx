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

interface ContentProps {
    data: LivreurDisponible[];
}

export default function Content({ data }: ContentProps) {
    const [selectedCourierId, setSelectedCourierId] = useState<string | null>(null);
    const [livreursAvecPosition, setLivreursAvecPosition] = useState<LivreurAvecPosition[]>([]);
    const [openDashboard, setOpenDashboard] = useState<boolean>(false);
    const [simulationActive, setSimulationActive] = useState<boolean>(false);
    
    const { isConnected } = useRealTime({ 
        data: livreursAvecPosition, 
        setData: setLivreursAvecPosition 
    });


    // Dispatching initial des livreurs
    useEffect(() => {
        if (data.length > 0 && livreursAvecPosition.length === 0) {
            const livreursDispatches = dispatcherLivreursAbidjanPondere(data);
            setLivreursAvecPosition(livreursDispatches);
        }
    }, [data, livreursAvecPosition.length]);

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

    // Statistiques par commune
    const statsCommunales = useMemo(() => {
        const stats = new Map<string, number>();
        livreursAvecPosition.forEach(livreur => {
            if (livreur.position?.commune) {
                stats.set(livreur.position.commune, (stats.get(livreur.position.commune) || 0) + 1);
            }
        });
        return Array.from(stats.entries()).sort((a, b) => b[1] - a[1]);
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

    const redistribuerLivreurs = useCallback(() => {
        const nouveauxLivreurs = dispatcherLivreursAbidjanPondere(data);
        setLivreursAvecPosition(nouveauxLivreurs);
        setSelectedCourierId(null);
    }, [data]);

    // Statistiques générales
    const stats = useMemo(() => {
        const total = livreursAvecPosition.length;
        const connectes = livreursValides.length;
        
        return { total, connectes };
    }, [livreursAvecPosition, livreursValides]);

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
                        className={`relative inline-flex h-[6px] w-[6px] rounded-full ${
                            isConnected ? 'bg-green-500' : 'bg-red-500'
                        }`} 
                    />
                </div>
                <span className="text-sm font-medium">
                    {isConnected ? 'Connecté' : 'Déconnecté'} • {stats.connectes}/{stats.total} livreurs
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
                
                <Button
                    size="sm"
                    variant="bordered"
                    startContent={<RefreshCw size={16} />}
                    onClick={redistribuerLivreurs}
                >
                    Redistribuer
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
            <Card className="w-full max-w-6xl mx-auto">
                <CardHeader className="flex justify-center items-center pb-2">
                    <Button 
                        size="sm" 
                        onClick={toggleDashboard}
                        isIconOnly 
                        startContent={<ChevronDown />} 
                        variant="light" 
                    />
                </CardHeader>
                <CardBody className="space-y-6 px-6 pb-6">
                    {/* Statistiques générales */}
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                            <div className="font-semibold text-xl">{stats.total}</div>
                            <div className="text-gray-500">Total</div>
                        </div>
                        <div>
                            <div className="font-semibold text-xl text-green-600">{stats.connectes}</div>
                            <div className="text-gray-500">Positionnés</div>
                        </div>
                    </div>

                    {/* Répartition par communes */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-sm text-gray-600">Répartition par communes</h3>
                        <div className="flex flex-wrap gap-2">
                            {statsCommunales.map(([commune, count]) => (
                                <Chip 
                                    key={commune}
                                    size="sm" 
                                    variant="flat"
                                    color="primary"
                                >
                                    {commune}: {count}
                                </Chip>
                            ))}
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
                        livreurs={livreursAvecPosition} 
                        handleCourierSelect={handleCourierSelect} 
                    />
                    <LivreursListBottom 
                        livreurs={livreursAvecPosition} 
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
            <div className="relative flex-1">
                <MapContainer
                    couriers={livreursValides}
                    selectedCourierId={selectedCourierId}
                    onMarkerClick={handleCourierSelect}
                />

                {/* Message de chargement */}
                {livreursAvecPosition.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                        <Card className="p-4">
                            <CardBody className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-gray-600">
                                    Dispatching des livreurs sur Abidjan...
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                )}

                {/* Dashboard flottant */}
                <div className="absolute -bottom-8 w-full">
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
                            <DashboardPanel />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}