'use client';
import { title } from '@/components/primitives';
import { CourseExterne, PaginatedResponse, Restaurant } from '@/types/models';
import { Clock, MapPin, User, Package, CreditCard, Store, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Chip, Divider, Pagination, Skeleton, Select, SelectItem } from "@heroui/react";
import { IconPlus } from '@tabler/icons-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SORT_OPTIONS } from '@/data';
import DeliveryTools from './component/deliveryTools';
import { getPaginationCourseExterne } from '@/src/actions/courses.actions';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { courses_statuses_filters } from '@/data';
import EmptyDataTable from '@/components/commons/EmptyDataTable';

type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

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
            return 'border-l-4 sm:border-2 border-warning bg-warning/5';
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
    // États
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS.DATE_DESC);
    const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [data, setData] = useState<PaginatedResponse<CourseExterne> | null>(initialData);
    const [dataFilter, setDataFilter] = useState<CourseExterne[]>(data?.content ?? []);
    const [isLoading, setIsLoading] = useState(!initialData);

    // Fonction pour filtrer les données basée sur le terme de recherche et le statut
    const filteredData = useMemo(() => {
        let filtered = data?.content ?? [];
        
        // Filtrage par statut
        if (statusFilter !== 'all') {
            filtered = filtered.filter((d) => d.statut?.toUpperCase() === statusFilter);
        }
        
        // Filtrage par terme de recherche (code)
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((d) => 
                d.code?.toLowerCase().includes(searchLower)
            );
        }
        
        return filtered;
    }, [data?.content, statusFilter, searchTerm]);

    // Effet pour mettre à jour dataFilter quand filteredData change
    useEffect(() => {
        setDataFilter(filteredData);
    }, [filteredData]);

    const handleFilter = (status: string, _data?: PaginatedResponse<CourseExterne> | null) => {
        setIsLoading(true);
        setStatusFilter(status);
        setIsLoading(false);
    };

    // Fonction de récupération des données
    const fetchData = async (page: number) => {
        setCurrentPage(page);
        setIsLoading(true);
        try {
            const newData = await getPaginationCourseExterne(restaurant.id ?? '', page - 1, pageSize);
            setData(newData);
            setStatusFilter('all');
            setSearchTerm(''); // Reset search when changing page
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handlers
    const handleReset = () => {
        setSearchTerm('');
        setSortBy(SORT_OPTIONS.DATE_DESC);
        setCurrentPage(1);
        setStatusFilter('all');
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const toggleExpand = (deliveryId: string) => {
        setExpandedDelivery(expandedDelivery === deliveryId ? null : deliveryId);
    };

    return (
        <div className="w-full min-h-screen bg-background">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
                <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
                    
                    {/* Header - Mobile First Design */}
                    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <h1 className={title({ 
                                size: 'h3', 
                                class: 'text-primary text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold' 
                            })}>
                                Mes Courses
                            </h1>
                            <p className="text-default-500 text-sm sm:text-base hidden sm:block">
                                Gérez vos demandes de coursier
                            </p>
                        </div>
                        <Button 
                            as={Link} 
                            href="/delivery/create" 
                            color="primary" 
                            size="lg"
                            startContent={<IconPlus className="h-4 w-4 sm:h-5 sm:w-5" />}
                            className="w-full sm:w-auto font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <span className="block sm:hidden">Nouvelle demande</span>
                            <span className="hidden sm:block">Demande de coursier</span>
                        </Button>
                    </div>

                    {/* Filtres - Amélioré pour mobile avec champ de recherche */}
                    <div className="bg-default-50 rounded-xl p-3 sm:p-4 lg:p-6 border border-default-200">
                        <div className="space-y-3 sm:space-y-4">
                            <h3 className="text-base sm:text-lg font-semibold text-default-700">Filtrer les courses</h3>
                            
                            {/* Champ de recherche par code */}
                            <div className="w-full">
                                <Input
                                    placeholder="Rechercher par code de course..."
                                    value={searchTerm}
                                    onValueChange={handleSearchChange}
                                    startContent={<Search className="h-4 w-4 text-default-400" />}
                                    variant="bordered"
                                    size="md"
                                    className="w-full"
                                    classNames={{
                                        input: "text-sm",
                                        inputWrapper: "bg-background border-default-300 data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary"
                                    }}
                                    isClearable
                                    onClear={() => setSearchTerm('')}
                                />
                            </div>
                            
                            {/* Filtres par statut - Responsive grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                                {courses_statuses_filters.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={statusFilter === category.id ? 'solid' : 'flat'}
                                        color={statusFilter === category.id ? 'primary' : 'default'}
                                        onPress={() => handleFilter(category.id)}
                                        size="sm"
                                        className="text-xs sm:text-sm font-medium w-full justify-center transition-all duration-200"
                                    >
                                        {category.name}
                                    </Button>
                                ))}
                            </div>

                            {/* Bouton de réinitialisation et compteur de résultats */}
                            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4 pt-2">
                                <div className="text-sm text-default-500">
                                    {dataFilter.length} course{dataFilter.length !== 1 ? 's' : ''} trouvée{dataFilter.length !== 1 ? 's' : ''}
                                    {searchTerm && ` pour "${searchTerm}"`}
                                </div>
                                {(searchTerm || statusFilter !== 'all') && (
                                    <Button 
                                        size="sm" 
                                        variant="flat" 
                                        color="default"
                                        onPress={handleReset}
                                        className="w-full xs:w-auto"
                                    >
                                        Réinitialiser
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contenu principal avec loading states améliorés */}
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
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                                    <CardBody className="p-3 sm:p-4 text-center">
                                        <p className="text-lg sm:text-2xl font-bold text-primary">{dataFilter.length}</p>
                                        <p className="text-xs sm:text-sm text-default-600">
                                            {searchTerm || statusFilter !== 'all' ? 'Résultats' : 'Total'}
                                        </p>
                                    </CardBody>
                                </Card>
                                <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20">
                                    <CardBody className="p-3 sm:p-4 text-center">
                                        <p className="text-lg sm:text-2xl font-bold text-success">
                                            {dataFilter.filter(d => d.statut?.toUpperCase() === 'TERMINER').length}
                                        </p>
                                        <p className="text-xs sm:text-sm text-default-600">Terminées</p>
                                    </CardBody>
                                </Card>
                                <Card className="bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20">
                                    <CardBody className="p-3 sm:p-4 text-center">
                                        <p className="text-lg sm:text-2xl font-bold text-warning">
                                            {dataFilter.filter(d => d.statut?.toUpperCase() === 'VALIDER').length}
                                        </p>
                                        <p className="text-xs sm:text-sm text-default-600">En cours</p>
                                    </CardBody>
                                </Card>
                                <Card className="bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20">
                                    <CardBody className="p-3 sm:p-4 text-center">
                                        <p className="text-lg sm:text-2xl font-bold text-secondary">
                                            {dataFilter.filter(d => d.statut?.toUpperCase() === 'EN_ATTENTE').length}
                                        </p>
                                        <p className="text-xs sm:text-sm text-default-600">En attente</p>
                                    </CardBody>
                                </Card>
                            </div>

                            {/* Liste des courses - Design amélioré */}
                            <div className="space-y-4 sm:space-y-6">
                                {dataFilter.map((delivery) => (
                                    <Card key={delivery.id} className={`w-full transition-all duration-300 hover:shadow-lg ${getStatusBorderClass(delivery.statut)}`}>
                                        
                                        {/* Header de la carte - Mobile optimized */}
                                        <CardHeader className="p-4 sm:p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 w-full">
                                                
                                                {/* Info principale */}
                                                <div className="flex flex-col space-y-2 flex-1 min-w-0">
                                                    <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
                                                        <Chip 
                                                            color={getStatusColor(delivery.statut)} 
                                                            variant="flat"
                                                            size="sm"
                                                            className="w-fit font-medium"
                                                        >
                                                            {delivery.statut}
                                                        </Chip>
                                                        <span className="text-default-500 font-bold text-sm sm:text-base">
                                                            Code: {delivery.code}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Info restaurant mobile */}
                                                    <div className="flex items-center gap-2 sm:hidden">
                                                        <Store className="text-default-400 h-4 w-4 flex-shrink-0" />
                                                        <span className="text-sm text-default-600 truncate">
                                                            {delivery.restaurant.nomEtablissement}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 sm:gap-3 self-end xs:self-auto">
                                                    <DeliveryTools restaurant={restaurant} delivery={delivery} />
                                                    <Button 
                                                        isIconOnly 
                                                        color="primary" 
                                                        variant="light" 
                                                        onClick={() => toggleExpand(delivery.id)}
                                                        size="sm"
                                                        className="hover:bg-primary/10 transition-colors"
                                                    >
                                                        {expandedDelivery === delivery.id ? 
                                                            <ChevronUp className="h-4 w-4" /> : 
                                                            <ChevronDown className="h-4 w-4" />
                                                        }
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardBody className="p-4 sm:p-6 pt-0">
                                            <div className="space-y-4 sm:space-y-5">
                                                
                                                {/* Info restaurant desktop */}
                                                <div className="hidden sm:flex items-start gap-3">
                                                    <Store className="text-default-500 mt-1 h-5 w-5 flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-default-700 font-medium text-base">
                                                            {delivery.restaurant.nomEtablissement}
                                                        </p>
                                                        <p className="text-default-500 text-sm">
                                                            {delivery.restaurant.commune}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Divider className="hidden sm:block" />

                                                {/* Résumé commande - Layout amélioré */}
                                                <div className="bg-default-50 rounded-lg p-3 sm:p-4">
                                                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3 xs:gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Package className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                                                            <span className="text-sm sm:text-base font-medium">
                                                                {delivery.nombreCommande} commande{delivery.nombreCommande > 1 ? 's' : ''}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl sm:text-2xl font-bold text-primary">
                                                                {delivery.total.toFixed(2)}
                                                            </span>
                                                            <span className="text-sm text-default-500">XOF</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Horaires - Design compact */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="text-success h-4 w-4 flex-shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs text-default-500">Début</p>
                                                            <p className="text-sm font-medium text-default-700 truncate">
                                                                {delivery.dateHeureDebut}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="text-warning h-4 w-4 flex-shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs text-default-500">Fin</p>
                                                            <p className="text-sm font-medium text-default-700 truncate">
                                                                {delivery.dateHeureFin ?? 'En cours...'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Section détails expandable - Améliorée */}
                                                {expandedDelivery === delivery.id && (
                                                    <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 border-t pt-4 sm:pt-6">
                                                        <h4 className="text-base sm:text-lg font-semibold text-default-700 mb-3 sm:mb-4">
                                                            Détails des commandes ({delivery.commandes.length})
                                                        </h4>
                                                        
                                                        <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
                                                            {delivery.commandes.map((commande, index) => (
                                                                <Card key={commande.id} className="bg-default-25 border border-default-200">
                                                                    <CardHeader className="p-3 sm:p-4 pb-2">
                                                                        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4 w-full">
                                                                            <div className="flex flex-col xs:flex-row xs:items-center gap-2">
                                                                                <Chip 
                                                                                    size="sm" 
                                                                                    variant="flat" 
                                                                                    color={getCommandeStatusColor(commande.statut)}
                                                                                    className="w-fit"
                                                                                >
                                                                                    {commande.statut ?? 'EN_ATTENTE'}
                                                                                </Chip>
                                                                                <span className="text-default-600 font-medium text-sm">
                                                                                    Commande #{commande.numero}
                                                                                </span>
                                                                            </div>
                                                                            <Chip size="sm" variant="solid" color="primary">
                                                                                {index + 1}
                                                                            </Chip>
                                                                        </div>
                                                                    </CardHeader>
                                                                    
                                                                    <CardBody className="p-3 sm:p-4 pt-0">
                                                                        <div className="space-y-3">
                                                                            
                                                                            {/* Destinataire */}
                                                                            <div className="flex items-start gap-2">
                                                                                <User className="text-default-500 mt-0.5 h-4 w-4 flex-shrink-0" />
                                                                                <div className="min-w-0 flex-1">
                                                                                    <p className="text-default-700 font-medium text-sm">
                                                                                        {commande.destinataire.nomComplet}
                                                                                    </p>
                                                                                    <p className="text-default-500 text-xs break-all">
                                                                                        {commande.destinataire.contact}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            {/* Lieu de livraison */}
                                                                            <div className="flex items-start gap-2">
                                                                                <MapPin className="text-default-500 mt-0.5 h-4 w-4 flex-shrink-0" />
                                                                                <div className="min-w-0 flex-1">
                                                                                    <p className="text-xs text-default-500">Coordonnées</p>
                                                                                    <p className="text-default-600 text-xs font-mono break-all">
                                                                                        {`${commande.lieuLivraison.latitude}, ${commande.lieuLivraison.longitude}`}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            <Divider />

                                                                            {/* Prix et paiement */}
                                                                            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 xs:gap-4">
                                                                                <div className="flex items-center gap-2">
                                                                                    <CreditCard className="text-default-500 h-4 w-4" />
                                                                                    <span className="text-default-600 text-sm">
                                                                                        {commande.modePaiement}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center gap-1">
                                                                                    <span className="font-bold text-primary text-base">
                                                                                        {commande.prix.toFixed(2)}
                                                                                    </span>
                                                                                    <span className="text-xs text-default-500">XOF</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </CardBody>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination - Mobile optimized */}
                            <div className="flex justify-center mt-8 sm:mt-12 pb-6 sm:pb-8">
                                <div className="bg-background/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-default-200 shadow-lg">
                                    <Pagination 
                                        total={data?.totalPages ?? 1} 
                                        page={currentPage} 
                                        onChange={fetchData} 
                                        showControls 
                                        color="primary" 
                                        variant="bordered" 
                                        isDisabled={isLoading}
                                        size="sm"
                                        className="gap-1"
                                        classNames={{
                                            wrapper: "gap-1",
                                            item: "w-8 h-8 text-small",
                                            cursor: "bg-primary text-primary-foreground shadow-lg"
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center p-6 sm:p-8">
                            <EmptyDataTable />
                            <div className="mt-4 space-y-2">
                                <p className="text-default-500 text-sm sm:text-base">
                                    {searchTerm ? `Aucune course trouvée pour "${searchTerm}"` : 'Aucune course trouvée'}
                                </p>
                                {searchTerm || statusFilter !== 'all' ? (
                                    <Button 
                                        color="default" 
                                        variant="flat"
                                        size="sm"
                                        onPress={handleReset}
                                    >
                                        Réinitialiser les filtres
                                    </Button>
                                ) : (
                                    <Button 
                                        as={Link} 
                                        href="/delivery/create" 
                                        color="primary" 
                                        variant="flat"
                                        size="sm"
                                    >
                                        Créer votre première course
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}