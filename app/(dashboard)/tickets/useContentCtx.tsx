'use client';

import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { BonLivraisonTerminee } from '@/types';
import { PaginatedResponse } from '@/types/models';
import { Key, useCallback, useEffect, useState } from 'react';
import { CalendarDate, Chip, RangeValue } from '@heroui/react';
import { getBonLivraisonTerminees } from '@/src/actions/tickets.actions';

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

export const columns = [
    { name: 'CODE', uid: 'reference' },
    { name: 'LIVREUR', uid: 'livreur' },
    { name: 'COMMANDE TOTALE', uid: 'coutCommande' },
    { name: 'COÛT DE LIVRAISON', uid: 'coutLivraison' },
    { name: 'DATE ET HEURE', uid: 'date' },
    { name: 'STATUT DE LA COMMANDE', uid: 'statut' },
];

interface Props {
    initialData: PaginatedResponse<BonLivraisonTerminee> | null;
    restaurantId?: string;
}

export default function useContentCtx({ initialData, restaurantId }: Props) {
    const [isLoading, setIsLoading] = useState(!initialData);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [data, setData] = useState<PaginatedResponse<BonLivraisonTerminee> | null>(initialData);

    const [dates, setDates] = useState<RangeValue<CalendarDate> | null>(null);

    const handleDateChange = (value: RangeValue<CalendarDate>) => {
        if (value.start && value.end) {
            const newDates = {
                start: value.start,
                end: value.end,
            };
            setDates((state) => newDates);
            handlePageChange(1);
        }
    };
    const handlePageChange = (page: number) => {
        setCurrentPage((state) => page);
    };

    useEffect(() => {
        const fetchData = async () => {
            if ((dates?.start && dates?.end) || currentPage || pageSize) {
                setIsLoading(true);
                try {
                    const newData = await getBonLivraisonTerminees(restaurantId ?? '', currentPage - 1, pageSize, { dates: { start: dates?.start?.toString() ?? '', end: dates?.end?.toString() ?? '' } });
                    setData(newData);
                } catch (error) {
                    toast.error('Erreur lors de la récupération des données');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [dates?.start, dates?.end, currentPage, pageSize, restaurantId]);

    const renderCell = useCallback((bonLivraison: BonLivraisonTerminee, columnKey: Key) => {
        const cellValue = bonLivraison[columnKey as keyof BonLivraisonTerminee];
        switch (columnKey) {
            case 'livreur':
                return <p>{cellValue?.toString() ?? '-'}</p>;
            case 'coutLivraison':
                return (
                    <p>
                        {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'XOF',
                        }).format(Number(cellValue) || 0)}
                    </p>
                );
            case 'coutCommande':
                return (
                    <p>
                        {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'XOF',
                        }).format(Number(cellValue) || 0)}
                    </p>
                );
            case 'statut':
                return (
                    <Chip
                        color={getStatusColor(String(cellValue ?? ''))}
                        variant="flat" className="text-sm font-medium px-2 py-0.5 rounded-md">
                        {String(cellValue ?? '')}
                    </Chip>
                );
            case 'date':
                const datetimeString = `${bonLivraison.date}T${bonLivraison.heure}`;
                return <p>{dayjs(datetimeString).format('DD/MM/YYYY HH:mm:ss')}</p>;
            default:
                return cellValue;
        }
    }, []);

    return {
        renderCell,
        columns,
        data,
        handlePageChange,
        currentPage,
        isLoading,
        handleDateChange,
    };
}
