'use client';

import { Drink } from '@/types/models';
import { CalendarDate, RangeValue } from '@heroui/react';
import { Key, useCallback, useState } from 'react';

export const columns = [
    { name: 'Libelle', uid: 'libelle' },
    { name: 'Prix', uid: 'price' },
    { name: 'Volume', uid: 'volume' },
    { name: 'Actions', uid: 'actions' },
];

interface Props {
    initialData: Drink[] | null;
}

export default function useContentCtx({ initialData }: Props) {
    const [isLoading, setIsLoading] = useState(!initialData);
    const [data, setData] = useState<Drink[] | null>(initialData);

    const [dates, setDates] = useState<RangeValue<CalendarDate> | null>(null);

    const handleDateChange = (value: RangeValue<CalendarDate>) => {
        if (value.start && value.end) {
            setDates({
                start: value.start,
                end: value.end,
            });
        }
    };

    const renderCell = useCallback((drink: Drink, columnKey: Key) => {
        const cellValue = drink[columnKey as keyof Drink];
        switch (columnKey) {
            case 'libelle':
                return <p>{cellValue?.toString() ?? ''}</p>;
            case 'price':
                return <p>{String(cellValue)}</p>;
            case 'volume':
                return <p>{String(cellValue)}</p>;
            case 'actions':
                return <p>{String(cellValue)}</p>;
            default:
                return cellValue;
        }
    }, []);

    return {
        renderCell,
        columns,
        data,
        isLoading,
        handleDateChange,
    };
}
