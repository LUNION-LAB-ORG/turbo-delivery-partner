'use client';
import { title } from '@/components/primitives';
import { CourseExterne, PaginatedResponse, Restaurant } from '@/types/models';
import { Clock, MapPin, User, Package, CreditCard, Store, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Chip, Divider, Pagination, Skeleton, Select, SelectItem } from "@heroui/react";
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
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
            return 'border-2 border-warning';
        case 'TERMINER':
            return 'border-2 border-success';
        case 'ANNULER':
            return 'border-2 border-danger';
        case 'EN_ATTENTE':
            return 'border-2 border-secondary';
        default:
            return 'border border-default';
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

    const handleFilter = (status: string, _data?: PaginatedResponse<CourseExterne> | null) => {
        setIsLoading(true);
        setStatusFilter(status);

        if (status == 'all') {
            setDataFilter(data?.content ?? []);
        } else {
            const dd = typeof _data == 'undefined' ? data : _data;
            const dataFilter = dd?.content.filter((d) => d.statut?.toUpperCase() == status) ?? [];
            setDataFilter(dataFilter);
        }
        setIsLoading(false);
    };

    // Fonction de récupération des données
    const fetchData = async (page: number) => {
        setCurrentPage(page);
        setIsLoading(true);
        try {
            const newData = await getPaginationCourseExterne(restaurant.id ?? '', page - 1, pageSize);
            setData(newData);
            setDataFilter(newData?.content ?? []);
            setStatusFilter('all');
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
    };

    const toggleExpand = (deliveryId: string) => {
        setExpandedDelivery(expandedDelivery === deliveryId ? null : deliveryId);
    };

    return (
        <div className="w-full h-full pb-20 sm:pb-10 flex flex-1 flex-col gap-4 px-2 sm:px-4">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                <h1 className={title({ 
                    size: 'h3', 
                    class: 'text-primary text-xl sm:text-2xl lg:text-3xl' 
                })}>
                    Mes Courses
                </h1>
                <Button 
                    as={Link} 
                    href="/delivery/create" 
                    color="primary" 
                    size="sm" 
                    startContent={<IconPlus className="h-4 w-4 sm:h-5 sm:w-5" />}
                    className="w-full sm:w-auto text-sm"
                >
                    <span className="sm:hidden">Nouvelle demande</span>
                    <span className="hidden sm:inline">Demande de coursier</span>
                </Button>
            </div>

            {/* Filtres - Responsive */}
            <div className="flex flex-col gap-4 mb-4">
                <ScrollArea className="w-full whitespace-nowrap pb-2">
                    <div className="flex gap-2 px-2">
                        {courses_statuses_filters.map((category) => (
                            <Button
                                key={category.id}
                                className="flex-shrink-0 text-xs sm:text-sm"
                                variant={statusFilter === category.id ? 'solid' : 'flat'}
                                color={statusFilter === category.id ? 'primary' : 'default'}
                                onPress={() => handleFilter(category.id)}
                                size="sm"
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="h-0" />
                </ScrollArea>
            </div>

            {/* Contenu principal */}
            {isLoading ? (
                <div className="flex flex-col gap-4 sm:gap-6">
                    {[...Array(2)].map((_, index) => (
                        <Skeleton key={index} className="rounded-lg h-48 sm:h-52" />
                    ))}
                </div>
            ) : (data && data?.content.length) ? (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        {dataFilter.map((delivery) => (
                            <Card key={delivery.id} className={`w-full ${getStatusBorderClass(delivery.statut)}`}>
                                {/* Header de la carte - Responsive */}
                                <CardHeader className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <Chip 
                                            color={getStatusColor(delivery.statut)} 
                                            variant="flat"
                                            size="sm"
                                            className="w-fit"
                                        >
                                            {delivery.statut}
                                        </Chip>
                                        <span className="text-default-500 font-bold text-sm sm:text-base">
                                            Code: {delivery.code}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 self-end sm:self-auto">
                                        <DeliveryTools restaurant={restaurant} delivery={delivery} />
                                        <Button 
                                            isIconOnly 
                                            color="primary" 
                                            variant="light" 
                                            onClick={() => toggleExpand(delivery.id)}
                                            size="sm"
                                        >
                                            {expandedDelivery === delivery.id ? 
                                                <ChevronUp className="h-4 w-4" /> : 
                                                <ChevronDown className="h-4 w-4" />
                                            }
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardBody className="p-3 sm:p-4">
                                    <div className="space-y-3 sm:space-y-4">
                                        {/* Informations restaurant - Responsive */}
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <Store className="text-default-500 mt-1 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-default-700 text-sm sm:text-base font-medium truncate">
                                                    {delivery.restaurant.nomEtablissement}
                                                </p>
                                                <p className="text-default-500 text-xs sm:text-sm truncate">
                                                    {delivery.restaurant.commune}
                                                </p>
                                            </div>
                                        </div>

                                        <Divider />

                                        {/* Résumé commande - Responsive */}
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                                            <div className="flex items-center gap-2">
                                                <Package className="text-default-500 h-4 w-4 sm:h-5 sm:w-5" />
                                                <span className="text-sm sm:text-base">
                                                    {delivery.nombreCommande} commande{delivery.nombreCommande > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <span className="text-lg sm:text-xl font-semibold text-primary">
                                                {delivery.total.toFixed(2)} XOF
                                            </span>
                                        </div>

                                        {/* Section détails expandable */}
                                        {expandedDelivery === delivery.id && (
                                            <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                                                {delivery.commandes.map((commande, index) => (
                                                    <Card key={commande.id} className="w-full">
                                                        <CardHeader className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 p-3">
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                                <Chip 
                                                                    size="sm" 
                                                                    variant="flat" 
                                                                    color={getCommandeStatusColor(commande.statut)}
                                                                    className="w-fit"
                                                                >
                                                                    {commande.statut ?? 'EN_ATTENTE'}
                                                                </Chip>
                                                                <span className="text-default-500 font-bold text-sm">
                                                                    Commande #{commande.numero}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-2 self-end sm:self-auto">
                                                                <Chip size="sm" variant="flat" color="secondary">
                                                                    {index + 1}
                                                                </Chip>
                                                            </div>
                                                        </CardHeader>
                                                        <CardBody className="p-3">
                                                            <div className="space-y-3">
                                                                {/* Destinataire */}
                                                                <div className="flex items-start gap-2">
                                                                    <User className="text-default-500 mt-1 h-4 w-4 flex-shrink-0" />
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-default-700 text-sm font-medium truncate">
                                                                            {commande.destinataire.nomComplet}
                                                                        </p>
                                                                        <p className="text-default-500 text-xs break-all">
                                                                            {commande.destinataire.contact}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Lieu de livraison */}
                                                                <div className="flex items-start gap-2">
                                                                    <MapPin className="text-default-500 mt-1 h-4 w-4 flex-shrink-0" />
                                                                    <p className="text-default-600 text-xs sm:text-sm break-all">
                                                                        {`${commande.lieuLivraison.latitude}, ${commande.lieuLivraison.longitude}`}
                                                                    </p>
                                                                </div>

                                                                <Divider />

                                                                {/* Prix et paiement */}
                                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <CreditCard className="text-default-500 h-4 w-4" />
                                                                        <span className="text-default-600 text-sm">
                                                                            {commande.modePaiement}
                                                                        </span>
                                                                    </div>
                                                                    <span className="font-semibold text-primary">
                                                                        {commande.prix.toFixed(2)} XOF
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}

                                        <Divider />

                                        {/* Horaires - Responsive */}
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <Clock className="text-default-500 mt-1 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-default-600 text-xs sm:text-sm">
                                                    <span className="font-medium">Début:</span> {delivery.dateHeureDebut}
                                                </p>
                                                <p className="text-default-600 text-xs sm:text-sm">
                                                    <span className="font-medium">Fin:</span> {delivery.dateHeureFin ?? '---'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination - Responsive */}
                    <div className="flex justify-center mt-6 sm:mt-8 pb-4 sm:pb-0">
                        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-default-200">
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
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center min-h-[200px]">
                    <EmptyDataTable />
                </div>
            )}
        </div>
    );
}