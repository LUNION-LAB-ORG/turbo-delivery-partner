import { useTicketFilters } from '@/features/tickets/hooks/use-ticket-filters';
import { ITicketParams } from '@/features/tickets/types/tickets.type';
import { useMemo } from 'react';
import { useTicketsListQuery } from '@/features/tickets/queries/ticket-list.query';
import { useSession } from 'next-auth/react';

export default function useTickets() {
    const { filters, setFilter, resetFilters, setFilters } = useTicketFilters();
    const session = useSession();
    const restaurantId = session.data?.user.restauranID;

    const currentSearchParams: ITicketParams = useMemo(() => {
        return {
            page: filters.page,
            size: filters.size,
            search: filters.search,
            livreurId: filters.livreurId,
            restaurantId: restaurantId || '',
            debut: filters.debut,
            fin: filters.fin,
        };
    }, [filters, restaurantId]);

    const { data, isLoading, isFetching, isError, error } = useTicketsListQuery(currentSearchParams);

    const totalItems = data?.totalElements || 0;
    const pageCount = data?.totalPages || 0;
    const tickets = data?.content || [];
    const handlePageChange = (newPage: number) => {
        console.log('Changing to page:', newPage);
        setFilters((prev) => ({
            ...prev,
            page: newPage - 1,
        }));
    };
    return {
        filters,
        setFilters,
        resetFilters,
        tickets,
        isLoading,
        isError,
        error,
        isFetching,
        currentSearchParams,
        pagination: {
            pageCount,
            totalItems,
            handlePageChange,
        },
    };
}
