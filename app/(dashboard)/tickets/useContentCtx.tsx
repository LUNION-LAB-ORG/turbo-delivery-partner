'use client';

import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { PaginatedResponse } from '@/types/models';
import { BonLivraisonTerminee, ITicketsStats } from '@/types';
import { Key, useCallback, useEffect, useState } from 'react';
import { CalendarDate, Chip, RangeValue } from '@heroui/react';
import { calendarToDate, formatCFA, getStatusColor } from '@/features/helpers';
import { getBonLivraisonStatsRequest, getBonLivraisonTerminees } from '@/src/actions/tickets.actions';


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
    initStats: ITicketsStats;
}

export default function useContentCtx({ initialData, restaurantId, initStats }: Props) {
    const [isLoading, setIsLoading] = useState(!initialData);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [data, setData] = useState<PaginatedResponse<BonLivraisonTerminee> | null>(initialData);
    const [stats, setStats] = useState<ITicketsStats | null>(initStats);

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
    const handlePageChange = (page: number) => setCurrentPage((state) => page);
    useEffect(() => {
        const fetchData = async () => {
            if ((dates?.start && dates?.end) || currentPage || pageSize) {
                setIsLoading(true);
                try {
                    const params = {
                        restaurantId,
                        page: currentPage - 1,
                        size: pageSize,
                        ...(dates?.start && dates?.end && {
                            debut: calendarToDate(dates.start),
                            fin: calendarToDate(dates.end),
                        }),
                    };
                    
                    const newData = await getBonLivraisonTerminees(params);
                    const newStats = await getBonLivraisonStatsRequest(params);
                    
                    setData(newData);
                    setStats(newStats);
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
                return ( <p>{ formatCFA(cellValue ?? 0) }</p> );
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
                    <Chip color={getStatusColor(String(cellValue ?? ''))} variant="flat" className="text-sm font-medium px-2 py-0.5 rounded-md">
                        {String(cellValue ?? '')}
                    </Chip>
                );
            case 'date':
                const datetimeString = `${bonLivraison.date}T${bonLivraison.heure}`;
                return <p>{ dayjs(datetimeString).format('DD/MM/YYYY HH:mm:ss') }</p>;
            default:
                return cellValue;
        }
    }, []);

    return { renderCell, columns, data, stats, handlePageChange, currentPage, isLoading, handleDateChange };
}
