'use client';

import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from '@heroui/react';
import { title } from '@/components/primitives';
import useContentCtx from './useContentCtx';
import { Calendar, CircleFadingPlus, User } from 'lucide-react';
import { Drink } from '@/types/models';

interface ContentProps {
    initialData: Drink[] | null;
}

export default function Content({ initialData }: ContentProps) {
    const { columns, renderCell, data } = useContentCtx({ initialData });

    return (
        <div className="w-full h-full pb-10 flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className={title({ size: 'h3', class: 'text-primary' })}>Gestions des Boissons</h1>
            </div>

            <Table aria-label="Liste des boissons">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === 'actions' ? 'center' : 'start'}
                        >
                            <div className="flex gap-2 text-primary">
                                { column.uid === 'libelle' ? (
                                    <CircleFadingPlus size={15} />
                                ) : column.uid === 'price' ? (
                                    <Calendar size={15} />
                                ) : column.uid === 'volume' ? (
                                    <User size={15} />
                                ) : (
                                    <></>
                                )}
                                {column.name}
                            </div>
                        </TableColumn>
                    )}
                </TableHeader>

                <TableBody items={data ?? []} emptyContent={'Aucune boisson à afficher.'}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>{renderCell(item, columnKey) as React.ReactNode}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
