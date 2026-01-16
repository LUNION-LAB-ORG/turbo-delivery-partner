'use client';

import { flexRender } from '@tanstack/react-table';
import { formatCFA } from '@/features/helpers';
import { title } from '@/components/primitives';
import { TicketStatsCard } from '@/components/tickets/tickets-stats-card';
import { CalendarIcon, Search } from 'lucide-react';
import { useTicketsListTable } from '@/features/tickets/hooks/use-tickets-list-table';
import { Input, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { ticketColumns } from '@/components/tickets/ticket-columns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

export default function Content() {
    const {
        table,
        ticketsStats,
        isLoading,
        isError,
        error,
        isFetching,
        pagination,
        filters,
        setFilters,
        handleDateChange
    } = useTicketsListTable();
    return (
        <div className="w-full h-full pb-10 flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className={title({ size: 'h3', class: 'text-primary' })}>Mes Tickets</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TicketStatsCard isLoading={ticketsStats.isStatsLoading} title="Total des Frais de livraison"
                                 value={formatCFA(ticketsStats?.totalRevenus ?? 0)} variant="primary" />
                <TicketStatsCard isLoading={ticketsStats.isStatsLoading} title="Total des commissions"
                                 value={formatCFA(ticketsStats?.totalCommissions ?? 0)} />
            </div>

            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
                    <Input
                        startContent={<Search />}
                        className="w-full mt-1.5"
                        placeholder="Code du ticket"
                        value={filters.search}
                        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 0 }))}
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                data-empty={!filters.debut || !filters.fin}
                                className="data-[empty=true]:text-muted-foreground w-full sm:w-[280px] justify-start text-left font-normal"
                            >
                                <CalendarIcon />
                                {filters.debut && filters.fin ? (
                                    <span className="ml-2">
                                        {format(new Date(filters.debut), 'dd/MM/yyyy')} - {format(new Date(filters.fin), 'dd/MM/yyyy')}
                                    </span>
                                ) : (
                                    <span className="ml-2">Sélectionner une plage de dates</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="range"
                                selected={{
                                    from: filters.debut,
                                    to: filters.fin
                                }}
                                onSelect={(value) => handleDateChange(value)}
                            />
                        </PopoverContent>
                    </Popover>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="overflow-x-auto">
                        <Table
                            isStriped
                        >
                            <TableHeader>
                                {table.getFlatHeaders().map((header) => (
                                    <TableColumn className="text-primary" key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableColumn>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 10 }).map((_, i) => (
                                        <TableRow key={`skeleton-${i}`}>
                                            {ticketColumns.map((col) => (
                                                <TableCell key={`skeleton-cell-${col.header}`} className="h-12">
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : isError ? (
                                    <TableRow>
                                        <TableCell colSpan={ticketColumns.length} className="h-24 text-center">
                                            <div className="text-destructive">
                                                Erreur lors du chargement des données
                                                {error?.message && `: ${error.message}`}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}
                                                  className={isFetching ? 'opacity-70' : ''}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell
                                                    key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={ticketColumns.length} className="h-24 text-center">
                                            Aucun résultat trouvé
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {pagination?.pageCount! > 1 && (
                        <div className="flex justify-center pt-4 sm:pt-6">
                            <Pagination total={pagination?.pageCount ?? 1} page={filters.page + 1}
                                        onChange={pagination.handlePageChange} color="primary" />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
