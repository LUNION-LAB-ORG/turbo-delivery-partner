import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useQueryStates } from 'nuqs';
import { subMonths } from 'date-fns';
import { factureFiltersClient } from '@/features/factures/filters/facture.filter';
import { IFactureParams } from '@/features/factures/types/facture.types';
import { useFacturesQuery } from '@/features/factures/queries/facture.query';
import { factureTableColumns } from '@/components/factures/facture-table-columns';
import { useSession } from 'next-auth/react';

function useFactureTable() {
    const [filters, setFilters] = useQueryStates(factureFiltersClient.filter, factureFiltersClient.option);
    const session = useSession();
    const restaurantId = session.data?.user.restauranID;

    const currentSearchParams: IFactureParams = useMemo(() => {
        return {
            restaurantId,
            page: filters.page,
            size: filters.size,
            periodeDebut: filters.periodeDebut || undefined,
            periodeFin: filters.periodeFin || undefined,
            // statut: 'VALIDATED', TODO: Enlever apres les tests
        };
    }, [restaurantId, filters]);

    // Utiliser la query avec restaurantId (qui peut être vide)
    const { data: facturesData, isLoading, isFetching, isError } = useFacturesQuery(currentSearchParams);

    const table = useReactTable({
        data: facturesData?.content || [],
        columns: factureTableColumns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: facturesData?.totalPages || 0,
    });

    const pagination = {
        pageCount: facturesData?.totalPages || 0,
        totalItems: facturesData?.totalElements || 0,
        page: filters.page,
        handlePageChange: (newPage: number) => {
            setFilters({ page: newPage - 1 }); // Convert from 1-based to 0-based
        },
    };

    const handleSizeChange = (newSize: number) => {
        setFilters({ size: newSize, page: 0 }); // Reset to first page when changing size
    };

    const handlePeriodeFilterChange = (debut?: Date, fin?: Date) => {
        setFilters({
            periodeDebut: debut ? new Date(debut) : subMonths(new Date(), 1),
            periodeFin: fin ? new Date(fin) : new Date(),
            page: 0,
        });
    };

    return {
        factureTable: table,
        factures: facturesData,
        isFactureLoading: isLoading,
        isFactureFetching: isFetching,
        isFactureError: isError,
        pagination,
        filters,
        setFilters,
        handleSizeChange,
        handlePeriodeFilterChange,
    };
}

export default useFactureTable;
