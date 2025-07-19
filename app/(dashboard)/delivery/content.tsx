'use client';
import { title } from '@/components/primitives';
import { CourseExterne, PaginatedResponse, Restaurant } from '@/types/models';
import { Clock, MapPin, User, Package, CreditCard, Store, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Chip, Divider, Pagination, Skeleton } from '@heroui/react';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import Link from 'next/link';
import { SORT_OPTIONS, courses_statuses_filters } from '@/data';
import DeliveryTools from './component/deliveryTools';
import { getPaginationCourseExterne } from '@/src/actions/courses.actions';
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

        const dd = typeof _data == 'undefined' ? data : _data;
        const filtered = status === 'all' ? (dd?.content ?? []) : (dd?.content.filter((d) => d.statut?.toUpperCase() === status) ?? []);

        setDataFilter(filtered);
        setIsLoading(false);
    };

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

    const toggleExpand = (deliveryId: string) => {
        setExpandedDelivery(expandedDelivery === deliveryId ? null : deliveryId);
    };

    return (
        <div className="w-full h-full pb-10 flex flex-col gap-4">
            <div className="flex flex-row flex-wrap items-center justify-between gap-2">
                <h1 className={title({ size: 'h3', class: 'text-primary' })}>Mes Courses</h1>
                <Button as={Link} href="/delivery/create" color="primary" size="sm" startContent={<IconPlus className="h-5 w-5" />}>
                    Demande de coursier
                </Button>
            </div>

            {/* Filtres horizontal scroll */}
            <div className="w-full overflow-x-auto py-2">
                <div className="grid gap-2 min-w-max grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {courses_statuses_filters.map((category) => (
                        <Button
                            key={category.id}
                            className="w-full"
                            variant={statusFilter === category.id ? 'solid' : 'flat'}
                            color={statusFilter === category.id ? 'primary' : 'default'}
                            onPress={() => handleFilter(category.id)}
                            size="sm"
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col gap-6">
                    {[...Array(2)].map((_, index) => (
                        <Skeleton key={index} className="rounded-lg h-52" />
                    ))}
                </div>
            ) : data && data?.content.length ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {dataFilter.map((delivery) => (
                            <Card key={delivery.id} className={`w-full ${getStatusBorderClass(delivery.statut)}`}>
                                <CardHeader className="flex justify-between">
                                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                                        <Chip color={getStatusColor(delivery.statut)} variant="flat">
                                            {delivery.statut}
                                        </Chip>
                                        <span className="text-default-500 font-bold">Code: {delivery.code}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <DeliveryTools restaurant={restaurant} delivery={delivery} />
                                        <Button isIconOnly color="primary" variant="light" onClick={() => toggleExpand(delivery.id)}>
                                            {expandedDelivery === delivery.id ? <ChevronUp /> : <ChevronDown />}
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardBody>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-2">
                                            <Store className="text-default-500 mt-1" />
                                            <div>
                                                <p className="text-default-700">{delivery.restaurant.nomEtablissement}</p>
                                                <p className="text-default-500 text-sm">{delivery.restaurant.commune}</p>
                                            </div>
                                        </div>

                                        <Divider />

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Package className="text-default-500" />
                                                <span>
                                                    {delivery.nombreCommande} commande{delivery.nombreCommande > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <span className="text-lg font-semibold">{delivery.total.toFixed(2)} XOF</span>
                                        </div>

                                        {expandedDelivery === delivery.id && (
                                            <div className="mt-4 space-y-4">
                                                {delivery.commandes.map((commande, index) => (
                                                    <Card key={commande.id} className="w-full">
                                                        <CardHeader className="flex justify-between">
                                                            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                                                                <Chip size="sm" variant="flat" color={getCommandeStatusColor(commande.statut)}>
                                                                    {commande.statut ?? 'EN_ATTENTE'}
                                                                </Chip>
                                                                <span className="text-default-500 font-bold text-sm sm:text-base">Commande #{commande.numero}</span>
                                                            </div>
                                                            <span className="text-default-500 font-bold">{index + 1}</span>
                                                        </CardHeader>
                                                        <CardBody>
                                                            <div className="space-y-3">
                                                                <div className="flex items-start gap-2">
                                                                    <User className="text-default-500 mt-1" />
                                                                    <div>
                                                                        <p className="text-default-700">{commande.destinataire.nomComplet}</p>
                                                                        <p className="text-default-500">{commande.destinataire.contact}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-start gap-2">
                                                                    <MapPin className="text-default-500 mt-1" />
                                                                    <p className="text-default-600 text-sm">
                                                                        {commande.lieuLivraison.latitude}, {commande.lieuLivraison.longitude}
                                                                    </p>
                                                                </div>

                                                                <Divider />

                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-2">
                                                                        <CreditCard className="text-default-500" />
                                                                        <span className="text-default-600">{commande.modePaiement}</span>
                                                                    </div>
                                                                    <span className="font-semibold">{commande.prix.toFixed(2)} XOF</span>
                                                                </div>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}

                                        <Divider />

                                        <div className="flex items-center gap-2">
                                            <Clock className="text-default-500" />
                                            <div>
                                                <p className="text-default-600 text-sm">Début: {delivery.dateHeureDebut}</p>
                                                <p className="text-default-600 text-sm">Fin: {delivery.dateHeureFin ?? '---'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination Responsive */}
                    <div className="flex justify-center mt-8 sm:fixed sm:bottom-4 sm:left-0 sm:right-0 z-10">
                        <div className="relative w-full max-w-screen-sm mx-auto">
                            <Pagination total={data?.totalPages ?? 1} page={currentPage} onChange={fetchData} showControls color="primary" variant="bordered" isDisabled={isLoading} />
                        </div>
                    </div>
                </>
            ) : (
                <EmptyDataTable />
            )}
        </div>
    );
}
