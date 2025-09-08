"use client";

import EmptyDataTable from "@/components/commons/EmptyDataTable";
import { ArchiveFileAttente } from "@/types/file-attente.model";
import { LivreurTable } from "./livreur-table"; // Assure-toi du bon chemin

interface ArchiveLivreur {
    data: ArchiveFileAttente[];
    searchKey?: string;
}

export function Archive({ data }: ArchiveLivreur) {
    return (
        <div className="max-h-[600px] lg:overflow-y-auto lg:overflow-x-hidden md:overflow-scroll overflow-scroll">
            {(!data || data.length === 0) ? (
                <div className="text-center py-6 text-primary font-bold mt-10 text-xl">
                    <EmptyDataTable title="Aucun résultat" />
                </div>
            ) : (
                <LivreurTable
                    data={data.map((item) => ({
                        id: item.id,
                        nomComplet: item.nomComplet,
                        avatarUrl: item.avatarUrl || '',
                        createdAt: item.createdAt || "-", // tu peux adapter selon ton modèle
                        gotoffAt: item.gotoffAt || "-", 
                        restaurantId: item.restaurantId, 
                        livreurId: item.livreurId, 
                        updatedAt: item.updatedAt, 
                    }))}
                    itemsPerPage={10} // tu peux ajuster
                />
            )}
        </div>
    );
}
