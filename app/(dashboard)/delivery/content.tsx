'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/fr'

import Link from 'next/link';
import { SORT_OPTIONS } from '@/data';
import { IconPlus } from '@tabler/icons-react';
import { title } from '@/components/primitives';
import { courses_statuses_filters } from '@/data';
import createUrlFile from '@/utils/createUrlFile';
import DeliveryTools from './component/deliveryTools';
import { Clock, Package, Store, Search } from 'lucide-react';
import EmptyDataTable from '@/components/commons/EmptyDataTable';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getPaginationCourseExterne } from '@/src/actions/courses.actions';
import { CourseExterne, PaginatedResponse, Restaurant } from '@/types/models';
import { Button, Card, CardBody, CardHeader, Input, Chip, Pagination, Skeleton, Select, SelectItem, CardFooter, Avatar } from "@heroui/react";

type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];
dayjs.locale('fr')

// AJOUT : Définition des mois pour le filtre
const MONTHS_FILTERS = [
    { value: 'all', label: 'Tous les mois' },
    { value: '1', label: 'Janvier' },
    { value: '2', label: 'Février' },
    { value: '3', label: 'Mars' },
    { value: '4', label: 'Avril' },
    { value: '5', label: 'Mai' },
    { value: '6', label: 'Juin' },
    { value: '7', label: 'Juillet' },
    { value: '8', label: 'Août' },
    { value: '9', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' },
];

const getStatusColor = (statut: string) => {
    switch (statut?.toUpperCase()) {
        case 'VALIDER':
            return 'warning';
        case 'TERMINER':
            return 'success';
        case 'ANNULER':
            return 'danger';
        case 'EN_ATTENTE':
            return 'secondary';
        default:
            return 'default';
    }
};

const getStatusTextColor = (statut: string) => {
    switch (statut?.toUpperCase()) {
        case 'VALIDER': return 'text-yellow-700';
        case 'TERMINER': return 'text-green-700';
        case 'ANNULER': return 'text-red-700';
        case 'EN_ATTENTE': return 'text-gray-500';
        case 'PREPARATION': return 'text-orange-600';
        default: return 'text-gray-600';
    }
};

const getCommandeStatusColor = (statut: string) => {
    switch (statut?.toUpperCase()) {
        case 'EN_ATTENTE_VERSEMENT':
            return 'warning';
        case 'TERMINER':
            return 'success';
        case 'ANNULER':
            return 'danger';
        case 'RECUPERER':
            return 'secondary';
        case 'EN_COURS_LIVRAISON':
            return 'secondary';
        default:
            return 'default';
    }
};

const getStatusBorderClass = (statut: string) => {
    switch (statut.toUpperCase()) {
        case 'VALIDER':
            return 'border-l-4 sm:border-2 border-sky-500 bg-sky-500/5';
        case 'TERMINER':
            return 'border-l-4 sm:border-2 border-success bg-success/5';
        case 'ANNULER':
            return 'border-l-4 sm:border-2 border-danger bg-danger/5';
        case 'EN_ATTENTE':
            return 'border-l-4 sm:border-2 border-secondary bg-secondary/5';
        default:
            return 'border border-default-200';
    }
};

interface Props {
    restaurant: Restaurant;
    initialData: PaginatedResponse<CourseExterne> | null;
}

export default function Content({ restaurant, initialData }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [monthFilter, setMonthFilter] = useState('all'); // AJOUT : État pour le filtre par mois
    const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS.DATE_DESC);
    const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6);
    const [data, setData] = useState<PaginatedResponse<CourseExterne> | null>(initialData);
    const [dataFilter, setDataFilter] = useState<CourseExterne[]>(data?.content ?? []);
    const [isLoading, setIsLoading] = useState(!initialData);

    // === NOUVEAU ===
    // Fonction fetchData optimisée, mémorisée avec useCallback
    const fetchData = useCallback(async (page: number = currentPage) => {
        try {
            const newData = await getPaginationCourseExterne(restaurant.id ?? '', page - 1, pageSize);
            setData(newData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } 
    }, [restaurant.id, currentPage, pageSize]);

    // === Polling automatique toutes les 15s ===
    useEffect(() => {
        const intervalId = setInterval(() => fetchData(currentPage), 15000); // 15000ms = 15s

        return () => clearInterval(intervalId);
    }, [fetchData, currentPage]);

    // Fonction pour filtrer les données
    const filteredData = useMemo(() => {
        let filtered = data?.content ?? [];
        // Filtrage par statut
        if (statusFilter !== 'all') {
            filtered = filtered.filter((d) => d.statut?.toUpperCase() === statusFilter);
        }

        // Filtrage par terme de recherche (code)
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((d) => d.code?.toLowerCase().includes(searchLower));
        }

        // AJOUT : Filtrage par mois
        if (monthFilter !== 'all') {
            filtered = filtered.filter((d) => {
                if (!d.createdAt) return false;

                // Extraire le mois (1-12) depuis createdAt ISO
                const month = dayjs(d.createdAt).month() + 1; // month() retourne 0-11
                return month === Number(monthFilter);
            });
        }
        return filtered;
    }, [data?.content, statusFilter, searchTerm, monthFilter]); // AJOUT : Dépendance monthFilter

    // Effet pour mettre à jour dataFilter quand filteredData change
    useEffect(() => {
        setDataFilter(filteredData);
    }, [filteredData]);

    const handleFilter = (status: string, _data?: PaginatedResponse<CourseExterne> | null) => {
        setIsLoading(true);
        setStatusFilter(status);
        setIsLoading(false);
    };

    // Handlers
    const handleReset = useCallback((): void => {
        setSearchTerm('');
        setSortBy(SORT_OPTIONS.DATE_DESC);
        setCurrentPage(1);
        setStatusFilter('all');
        setMonthFilter('all');
    }, [setSearchTerm, setSortBy, setCurrentPage, setStatusFilter, setMonthFilter]);

    const handleSearchChange = (value: string) => setSearchTerm(value);

    const handleMonthChange = (keys: any) => {
        // HeroUI Select renvoie un Set, nous prenons le premier élément ou 'all' par défaut
        const selectedKey = Array.from(keys)[0] as string;
        console.log(selectedKey);
        setMonthFilter(selectedKey || 'all');
    };

    const toggleExpand = (deliveryId: string) => setExpandedDelivery(expandedDelivery === deliveryId ? null : deliveryId);

    return (
        <div className="w-full min-h-screen bg-background">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
                <div className="max-w-7xl mx-auto space-y-2 sm:space-y-6 lg:space-y-4">

                    {/* Header */}
                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <h1 className={title({
                                size: 'h3',
                                class: 'text-primary text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold'
                            })}>
                                Demandes de coursier
                            </h1>
                            <p className="text-default-500 text-sm sm:text-base hidden sm:block">
                                Gestion des demandes de coursier
                            </p>
                        </div>
                        <Button
                            as={Link}
                            href="/delivery/create"
                            color="primary"
                            size="lg"
                            startContent={<IconPlus className="h-4 w-4 sm:h-5 sm:w-5" />}
                            className="w-full sm:w-auto rounded-md font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <span className="block sm:hidden">Demande de coursier</span>
                            <span className="hidden sm:block">Demande de coursier</span>
                        </Button>
                    </div>

                    {/* Filtres */}
                    <div className="bg-default-50 rounded-md p-2 sm:p-4 border border-default-200">
                        <div className="space-y-2 sm:space-y-4">
                            <h3 className="text-base sm:text-lg font-semibold text-default-700">Filtrer les courses</h3>

                            {/* AJOUT : Conteneur flex pour la recherche et le filtre par mois */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    label="Recherche par code"
                                    placeholder="Rechercher par code..."
                                    value={searchTerm}
                                    onValueChange={handleSearchChange}
                                    startContent={<Search className="h-4 w-4 text-default-400" />}
                                    variant="bordered"
                                    size="md"
                                    className="w-full"
                                    classNames={{
                                        input: "text-sm",
                                        inputWrapper: "bg-background border-default-300 data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary rounded-md"
                                    }}
                                    isClearable
                                    onClear={() => setSearchTerm('')}
                                />

                                {/* AJOUT : Champ de filtre par mois */}
                                <Select
                                    label="Filtre par mois"
                                    placeholder="Sélectionner un mois"
                                    variant="bordered"
                                    size="md"
                                    className="w-full"
                                    selectedKeys={[monthFilter]}
                                    onSelectionChange={(keys: any) => handleMonthChange(keys)}
                                    classNames={{
                                        value: "text-sm",
                                        trigger: "bg-background border-default-300 data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary"
                                    }}
                                >
                                    {MONTHS_FILTERS.map((month) => (
                                        <SelectItem key={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            {/* Filtres par statut */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
                                {courses_statuses_filters.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={statusFilter === category.id ? 'solid' : 'flat'}
                                        color={statusFilter === category.id ? 'primary' : 'default'}
                                        onPress={() => handleFilter(category.id)}
                                        size="sm"
                                        className="text-xs sm:text-sm rounded-md font-medium w-full justify-center transition-all duration-200"
                                    >
                                        {category.name}
                                    </Button>
                                ))}
                            </div>

                            {/* Bouton de réinitialisation et compteur de résultats */}
                            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
                                <div className="text-sm text-default-500">
                                    {dataFilter.length} course{dataFilter.length !== 1 ? 's' : ''} trouvée{dataFilter.length !== 1 ? 's' : ''}
                                </div>
                                {/* AJOUT : Condition mise à jour pour inclure le filtre par mois */}
                                {(searchTerm || statusFilter !== 'all' || monthFilter !== 'all') && (
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        color="default"
                                        onPress={handleReset}
                                        className="w-full xs:w-auto"
                                    >
                                        Réinitialiser les filtres
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contenu principal */}
                    {isLoading ? (
                        <div className="space-y-4 sm:space-y-6">
                            {[...Array(3)].map((_, index) => (
                                <Card key={index} className="w-full">
                                    <CardBody className="p-4 sm:p-6">
                                        <div className="space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                                                <Skeleton className="h-6 w-24 rounded-full" />
                                                <Skeleton className="h-6 w-32 rounded-lg" />
                                            </div>
                                            <Skeleton className="h-4 w-full rounded-lg" />
                                            <Skeleton className="h-4 w-3/4 rounded-lg" />
                                            <div className="flex justify-between">
                                                <Skeleton className="h-4 w-20 rounded-lg" />
                                                <Skeleton className="h-6 w-24 rounded-lg" />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    ) : (dataFilter.length > 0) ? (
                        <>
                            {/* Stats rapides - Nouveau (basé sur les données filtrées) */}
                            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-4">
                                <Card className="bg-gradient-to-r rounded-md from-primary/10 to-primary/5 border-primary/20">
                                    <CardBody className="p-3 sm:p-4 text-center">
                                        <p className="text-lg sm:text-2xl font-bold text-primary">{dataFilter.length}</p>
                                        <p className="text-xs sm:text-sm text-default-600">
                                            {searchTerm || statusFilter !== 'all' ? 'Résultats' : 'Total'}
                                        </p>
                                    </CardBody>
                                </Card>

                                <Card className="bg-gradient-to-r rounded-md from-success/10 to-success/5 border-success/20">
                                    <CardBody className="p-3 sm:p-4 text-center">
                                        <p className="text-lg sm:text-2xl font-bold text-success">
                                            {dataFilter.filter(d => d.statut?.toUpperCase() === 'TERMINER').length}
                                        </p>
                                        <p className="text-xs sm:text-sm text-default-600">Terminées</p>
                                    </CardBody>
                                </Card>

                                <Card className="bg-gradient-to-r rounded-md from-sky-500/10 to-sky-500/5 border-sky-500/20">
                                    <CardBody className="p-3 sm:p-4 text-center">
                                        <p className="text-lg sm:text-2xl font-bold text-sky-500">
                                            {dataFilter.filter(d => d.statut?.toUpperCase() === 'VALIDER').length}
                                        </p>
                                        <p className="text-xs sm:text-sm text-default-600">Valider</p>
                                    </CardBody>
                                </Card>

                                <Card className="bg-gradient-to-r rounded-md from-warning/10 to-warning/5 border-warning/20">
                                    <CardBody className="p-3 sm:p-4 text-center">
                                        <p className="text-lg sm:text-2xl font-bold text-warning">
                                            {dataFilter.filter(d => d.statut?.toUpperCase() === 'EN_COURS').length}
                                        </p>
                                        <p className="text-xs sm:text-sm text-default-600">En cours</p>
                                    </CardBody>
                                </Card>

                                <Card className="bg-gradient-to-r rounded-md from-secondary/10 to-secondary/5 border-secondary/20">
                                    <CardBody className="p-3 sm:p-4 text-center">
                                        <p className="text-lg sm:text-2xl font-bold text-secondary">
                                            {dataFilter.filter(d => d.statut?.toUpperCase() === 'EN_ATTENTE').length}
                                        </p>
                                        <p className="text-xs sm:text-sm text-default-600">En attente</p>
                                    </CardBody>
                                </Card>

                                <Card className="bg-gradient-to-r rounded-md from-danger/10 to-danger/5 border-danger/20">
                                    <CardBody className="p-3 sm:p-4 text-center">
                                        <p className="text-lg sm:text-2xl font-bold text-danger">
                                            {dataFilter.filter(d => d.statut?.toUpperCase() === 'ANNULER').length}
                                        </p>
                                        <p className="text-xs sm:text-sm text-default-600">Annulées</p>
                                    </CardBody>
                                </Card>
                            </div>

                            {/* Liste des courses - Design amélioré */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {dataFilter.map((delivery) => (
                                    <Card key={delivery.id} className={`w-full bg-white ${getStatusBorderClass(delivery.statut)} shadow-md rounded-md`}>
                                        <CardHeader className="flex justify-between items-center py-3 border-b">
                                            <div className="flex items-center gap-5">
                                                <span className={`font-bold text-base ${getStatusTextColor(delivery.statut)}`}>Code: {delivery.code}</span>
                                                <span className="bg-gray-900 text-white font-semibold rounded px-2 ml-2 py-1">
                                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(
                                                        (delivery.commandes?.reduce((sum, cmd) => sum + (cmd.prix ?? 0), 0) || 0) +
                                                        (delivery.commandes?.reduce((sum, cmd) => sum + (cmd.fraisLivraison ?? 0), 0) || 0)
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <DeliveryTools delivery={delivery} restaurant={restaurant} />
                                            </div>
                                        </CardHeader>
                                        <CardBody className="py-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Package className="text-gray-400" />
                                                <span className="font-medium">
                                                    {delivery.nombreCommande} commande{delivery.nombreCommande > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="text-gray-400" />
                                                <span>Créé le {delivery.createdAt ? dayjs(delivery.createdAt).locale('fr').format('D MMMM YYYY [à] HH:mm') : '-'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="text-gray-400" />                                        

                                                {/* Statut */}
                                                <Chip
                                                    color={getStatusColor(delivery.statut)}
                                                    variant="flat" className="text-sm font-medium px-2 py-0.5 rounded-md">
                                                    {delivery.statut}
                                                </Chip>

                                                {/* Date de prise en charge */}
                                                <span className="text-sm text-gray-700">
                                                    Prise en charge : {delivery.pickupAt ? dayjs(delivery.pickupAt).format('DD/MM/YYYY HH:mm:ss') : '—'}
                                                </span>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center p-6 sm:p-8">
                            <EmptyDataTable
                                title="Aucune course trouvée"
                                message="Il semble qu'il n'y ait aucune course correspondant à vos critères de recherche ou de filtre."
                            />
                            <div className="mt-4 space-y-2">
                                {(searchTerm || statusFilter !== 'all' || monthFilter !== 'all') && (
                                    <Button
                                        color="default"
                                        variant="flat"
                                        size="sm"
                                        onPress={handleReset}
                                    >
                                        Effacer les filtres
                                    </Button>
                                )}
                                <Button
                                    as={Link}
                                    href="/delivery/create"
                                    color="primary"
                                    size="lg"
                                    startContent={<IconPlus className="h-4 w-4 sm:h-5 sm:w-5" />}
                                    className="w-full sm:w-auto rounded-md font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <span className="block sm:hidden">Demande de coursier</span>
                                    <span className="hidden sm:block">Demande de coursier</span>
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {data && data.totalPages > 1 && !searchTerm && monthFilter === 'all' && statusFilter === 'all' && (
                        <div className="flex justify-center pt-4 sm:pt-6">
                            <Pagination
                                total={data.totalPages}
                                page={currentPage}
                                onChange={fetchData}
                                color="primary"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}