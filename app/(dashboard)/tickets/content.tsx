'use client';

import useContentCtx from './useContentCtx';
import { formatCFA } from '@/features/helpers';
import { title } from '@/components/primitives';
import { PaginatedResponse } from '@/types/models';
import { BonLivraisonTerminee, ITicketsStats } from '@/types';
import { TicketStatsCard } from '@/components/tickets/tickets-stats-card';
import { Calendar, Cherry, CircleFadingPlus, Home, SquareMenu, ToggleRight, User } from 'lucide-react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Pagination, RangeValue, CalendarDate, DateRangePicker, CardBody, Card } from '@heroui/react';

interface ContentProps {
    initialData: PaginatedResponse<BonLivraisonTerminee> | null;
    restaurantId?: string;
    initStats: ITicketsStats;
}  

export default function Content({ initialData, restaurantId, initStats }: ContentProps) {
    const { columns, renderCell, data, stats, handlePageChange, currentPage, isLoading, handleDateChange } = useContentCtx({ initialData, initStats, restaurantId });

    return (
        <div className="w-full h-full pb-10 flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className={title({ size: 'h3', class: 'text-primary' })}>Mes Tickets</h3>
                <DateRangePicker className="w-full sm:max-w-xs" onChange={(value) => handleDateChange(value as RangeValue<CalendarDate>) } />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TicketStatsCard title="Total des Frais de livraison" value={formatCFA(stats?.revenus ?? 0)} variant="primary" />
                <TicketStatsCard title="Total des commissions" value={formatCFA(stats?.totalCommissions ?? 0)} />
            </div>

            <Table aria-label="Example table with custom cells rounded-md">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                            <div className="flex gap-2 text-primary">
                                {column.uid === 'reference' ? (
                                    <CircleFadingPlus size={15} />
                                ) : column.uid === 'date' ? (
                                    <Calendar size={15} />
                                ) : column.uid === 'livreur' ? (
                                    <User size={15} />
                                ) : column.uid === 'restaurant' ? (
                                    <Home size={15} />
                                ) : column.uid === 'coutLivraison' ? (
                                    <Cherry size={15} />
                                ) : column.uid === 'coutCommande' ? (
                                    <SquareMenu size={15} />
                                ) : column.uid === 'statut' ? (
                                    <ToggleRight size={15} />
                                ) : (
                                    <></>
                                )}
                                {column.name}
                            </div>
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={data?.content ?? []} emptyContent={'No rows to display.'}>
                    {(item) => <TableRow key={item.commandeId}>{(columnKey) => <TableCell>{renderCell(item, columnKey) as React.ReactNode}</TableCell>}</TableRow>}
                </TableBody>
            </Table>
            <div className="flex justify-center pt-4 sm:pt-6">
                <Pagination
                    total={data?.totalPages ?? 1}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </div>
        </div>
    );
}
