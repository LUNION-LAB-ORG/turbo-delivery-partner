"use client";
import { useState, useMemo } from "react";
import createUrlFile from '@/utils/createUrlFile';
import { formatDate } from "@/utils/date-formate";
import { User, Calendar, LogOut } from "lucide-react";
import { ArchiveFileAttente } from "@/types/file-attente.model";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@heroui/react";

interface Props {
    data: ArchiveFileAttente[];
    itemsPerPage?: number;
}

export function LivreurTable({ data, itemsPerPage = 5 }: Props) {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(itemsPerPage);

    // Filtrer par nomComplet, createdAt et gotoffAt
    const filteredData = useMemo(() => {
        const lower = search.toLowerCase();
        return data.filter(item =>
            item.nomComplet.toLowerCase().includes(lower) ||
            formatDate(item.createdAt, "DD/MM/YYYY HH:mm:ss").toLowerCase().includes(lower) ||
            (item.gotoffAt && formatDate(item.gotoffAt, "DD/MM/YYYY HH:mm:ss").toLowerCase().includes(lower))
        );
    }, [data, search]);

    // Pagination
    const startIndex = (currentPage - 1) * perPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + perPage);
    const totalPages = Math.max(1, Math.ceil(filteredData.length / perPage));

    const columns = [
        { uid: "livreur", name: "Livreur" },
        { uid: "createdAt", name: "Date d'entrée" },
        { uid: "gotoffAt", name: "Date de sortie" },
    ];

    const renderCell = (item: ArchiveFileAttente, columnKey: string) => {
        switch (columnKey) {
            case "livreur":
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img
                                src={item.avatarUrl ? createUrlFile(item.avatarUrl, 'backend') : '/assets/images/avatar.png'}
                                alt={item.nomComplet}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span>{item.nomComplet}</span>
                    </div>
                );
            case "createdAt":
                return formatDate(item.createdAt, "DD/MM/YYYY HH:mm:ss");
            case "gotoffAt":
                return item.gotoffAt
                    ? formatDate(item.gotoffAt.replace(/\.\d+Z$/, "Z"), "dd/mm/YYYY HH:mm:ss")
                    : "-";
            default:
                return null;
        }
    };

    return (
        <div className="space-y-3">
            {/* Champ de recherche */}
            <input
                type="text"
                placeholder="Rechercher par nom ou date..."
                className="border border-gray-300 rounded-md px-3 py-1 w-full max-w-sm"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}
            />

            {/* Tableau */}
            <Table aria-label="Liste des livreurs">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={String(column.uid)} align="start">
                            <div className="flex gap-2 text-primary items-center">
                                {column.uid === "livreur" && <User size={15} />}
                                {column.uid === "createdAt" && <Calendar size={15} />}
                                {column.uid === "gotoffAt" && <LogOut size={15} />}
                                {column.name}
                            </div>
                        </TableColumn>
                    )}
                </TableHeader>

                <TableBody items={paginatedData} emptyContent="Aucun livreur à afficher.">
                    {(item) => (
                        <TableRow key={String(item.id)}>
                            {(columnKey) => (
                                <TableCell>{renderCell(item, String(columnKey)) as React.ReactNode}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination + Sélecteur */}
            <div className="mt-2 flex justify-between items-center">
                {/* Select pour changer le nombre d’items par page */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Afficher</span>
                    <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-600">par page</span>
                </div>

                {/* Pagination */}
                <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
}
