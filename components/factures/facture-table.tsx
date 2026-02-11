'use client';

import React from 'react';
import { flexRender } from '@tanstack/react-table';
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import useFactureTable from '@/features/factures/hooks/use-facture-table';

export function FactureTable() {
    const { factureTable, isFactureLoading, isFactureFetching, pagination } = useFactureTable();

    const colsCount = factureTable.getAllColumns().length;

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <Table
                    isStriped
                    bottomContent={
                        pagination &&
                        pagination.pageCount > 1 && (
                            <div className="flex justify-center pt-4 sm:pt-6">
                                <Pagination total={pagination.pageCount} page={pagination.page + 1} onChange={pagination.handlePageChange} color="primary" />
                            </div>
                        )
                    }
                >
                    <TableHeader>
                        {factureTable.getFlatHeaders().map((header) => (
                            <TableColumn key={header.id} className="text-primary" allowsSorting={header.column.getCanSort()} onClick={header.column.getToggleSortingHandler()}>
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody emptyContent="Aucune facture trouvée">
                        {isFactureLoading
                            ? Array.from({ length: 10 }).map((_, i) => (
                                  <TableRow key={`skeleton-${i}`}>
                                      {Array.from({ length: colsCount }).map((_, j) => (
                                          <TableCell key={`skeleton-cell-${j}`} className="h-12">
                                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                                          </TableCell>
                                      ))}
                                  </TableRow>
                              ))
                            : factureTable.getRowModel().rows.map((row) => (
                                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className={isFactureFetching ? 'opacity-70' : ''}>
                                      {row.getVisibleCells().map((cell) => (
                                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                      ))}
                                  </TableRow>
                              ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
