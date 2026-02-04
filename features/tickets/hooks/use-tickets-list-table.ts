import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import useTickets from '@/features/tickets/hooks/use-tickets';
import { ticketColumns } from '@/components/tickets/ticket-columns';
import { DateRange } from 'react-day-picker';
import { useTicketsStatsQuery } from '@/features/tickets/queries/ticket-stats.query';
import useTicketsExport from '@/features/tickets/hooks/use-tickets-export';

export function useTicketsListTable() {
    const [rowSelection, setRowSelection] = useState({});
    const {
        filters,
        setFilters,
        tickets,
        isLoading,
        isError,
        error,
        isFetching,
        pagination,
        currentSearchParams
    } = useTickets();


    const {
        data: stats,
        isLoading: isStatsLoading,
        isError: isStatsError,
        error: statsError
    } = useTicketsStatsQuery(currentSearchParams);

    const table = useReactTable({
        columns: ticketColumns,
        data: tickets,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: pagination.pageCount,
        state: {
            pagination: {
                pageIndex: filters.page,
                pageSize: filters.size
            }
        },
        onPaginationChange: (updater) => {
            const newState = typeof updater === 'function' ? updater(table.getState().pagination) : updater;
            setFilters((prev) => ({
                ...prev,
                page: newState.pageIndex + 1,
                size: newState.pageSize
            }));
        }
    });

    const {
        handleExcelExport,
        handlePdfExport
    } = useTicketsExport();

    const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);

    const exportSelectedTickets = (format: 'xlsx' | 'pdf') => {
        if (format === 'xlsx') {
            handleExcelExport(selectedRows);
        } else {
            handlePdfExport(selectedRows);
        }
    };

    const handleDateChange = (value: DateRange | undefined) => {
        if (value?.from && value?.to) {
            setFilters((prev) => ({
                ...prev,
                debut: value.from ? new Date(value.from) : undefined,
                fin: value.to ? new Date(value.to) : undefined,
                page: 0
            }));
        }
    };

    return {
        filters,
        setFilters,
        table,
        isLoading,
        rowSelection,
        setRowSelection,
        isFetching,
        isError,
        error,
        pagination,
        handleDateChange,
        ticketsStats: {
            totalRevenus: stats?.revenus || 0,
            totalTickets: stats?.tickets || 0,
            totalLivreurs: stats?.livreurs || 0,
            totalPartenaires: stats?.restaurants || 0,
            totalCommissions: stats?.totalCommissions || 0,
            isStatsLoading,
            isStatsError,
            statsError
        },
        exports: {
            exportSelectedTickets
        }
    };
}
