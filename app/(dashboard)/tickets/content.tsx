'use client';

import { BonLivraisonVM } from '@/types';
import useContentCtx from './useContentCtx';
import { title } from '@/components/primitives';
import { PaginatedResponse } from '@/types/models';
import { Calendar, Cherry, CircleFadingPlus, Home, SquareMenu, ToggleRight, User } from 'lucide-react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Pagination, RangeValue, CalendarDate, DateRangePicker, CardBody, Card } from '@heroui/react';

interface ContentProps {
    initialData: PaginatedResponse<BonLivraisonVM> | null;
    restaurantId?: string;
}

export default function Content({ initialData, restaurantId }: ContentProps) {
    const { columns, renderCell, data, handlePageChange, currentPage, isLoading, handleDateChange } = useContentCtx({ initialData, restaurantId });

    return (
        <div className="w-full h-full pb-10 flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className={title({ size: 'h3', class: 'text-primary' })}>Mes Tickets</h3>
            </div>
            <Card>
                <CardBody className="flex items-center justify-between">
                    {/* Gauche */}
                    <div className="text-gray-700 font-medium">Rechercher par période</div>

                    {/* Droite */}
                    <DateRangePicker
                        className="max-w-xs"
                        onChange={(value) => handleDateChange(value as RangeValue<CalendarDate>)}
                    />
                </CardBody>
            </Card>
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
