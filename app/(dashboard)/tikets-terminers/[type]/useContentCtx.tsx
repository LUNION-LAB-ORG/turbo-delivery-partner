'use client';

import { getAllBonLivraisons, getAllBonLivraisonTerminers } from '@/src/actions/tickets.actions';
import { BonLivraisonVM } from '@/types';
import { PaginatedResponse } from '@/types/models';
import { CalendarDate, RangeValue, Switch } from '@heroui/react';
import { useParams } from 'next/navigation';
import { Key, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const columns = [
    { name: 'Référence', uid: 'reference' },
    { name: 'Date et Heure', uid: 'date' },
    { name: 'Livreur', uid: 'livreur' },
    { name: 'Coût livraison', uid: 'coutLivraison' },
    { name: 'Coût commande', uid: 'coutCommande' },
    { name: "Commission", uid: 'commission' },
    // { name: "Commission (Montant fixe)", uid: 'commission ' },
    { name: 'Terminé', uid: 'statut' },
];

interface Props {
    initialData: BonLivraisonVM[] | null;
    restaurantId?: string;
}

export default function useContentCtx({ initialData, restaurantId }: Props) {
    const { type } = useParams();
    const [isLoading, setIsLoading] = useState(!initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [data, setData] = useState<BonLivraisonVM[] | null>(initialData);

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
        const typeCommsion = type === "POURCENTAGE" ? "POURCENTAGE" : type === "FIXE" ? "FIXE" : ""
        const fetchData = async () => {
            if ((dates?.start && dates?.end) || currentPage || pageSize) {
                setIsLoading(true);
                try {
                    const newData = await getAllBonLivraisonTerminers(restaurantId ?? '', currentPage - 1, pageSize, { dates: { start: dates?.start?.toString() ?? '', end: dates?.end?.toString() ?? '' } }, typeCommsion as any);
                    setData(newData)
                } catch (error) {
                    toast.error('Erreur lors de la récupération des données');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [dates?.start, dates?.end, currentPage, pageSize, restaurantId]);



    const renderCell = useCallback((bonLivraison: BonLivraisonVM, columnKey: Key) => {
        const cellValue = bonLivraison[columnKey as keyof BonLivraisonVM];
        if (columnKey === "commission" && type === "POURCENTAGE") {
            return <p className='text-blue-600'>{cellValue + '  (10% CC)'}</p>;
        } else if (columnKey === "commission" && type === "FIXE") {
            return <p className='text-purple-600'>{cellValue + ' FCFA'}</p>;
        } else {
            switch (columnKey) {
                case 'livreur':
                    return <p>{cellValue?.toString() ?? '-'}</p>;
                case 'coutLivraison':
                    return <p>{String(cellValue) + ' FCFA'}</p>;
                case 'coutCommande':
                    return <p>{String(cellValue) + ' FCFA'}</p>;
                case 'statut':
                    return <Switch size="sm" color="primary" readOnly isSelected />;
                case 'reference':
                    return cellValue;
                case 'date':
                    return cellValue
                default:
                    return "";
            }
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
        type
    };
}
