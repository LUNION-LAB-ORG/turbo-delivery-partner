import { ColumnDef } from '@tanstack/react-table';
import { BonLivraisonTerminee } from '@/types';
import { getStatusColor } from '@/features/helpers';
import { Chip } from '@heroui/react';

export const ticketColumns: ColumnDef<BonLivraisonTerminee>[] = [
    {
        header: 'Référence',
        accessorKey: 'reference',
    },
    {
        header: 'Livreur',
        accessorKey: 'livreur',
    },
    {
        header: 'Coût de livraison',
        accessorKey: 'coutLivraison',
        cell: ({ row }) => {
            const coutLivraison = row.original.coutLivraison;
            return (
                <span>
                    {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                    }).format(Number(coutLivraison) || 0)}
                </span>
            );
        },
    },
    {
        header: 'Commande total',
        accessorKey: 'coutCommande',
        cell: ({ row }) => {
            const coutCommande = row.original.coutCommande;
            return (
                <span>
                    {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                    }).format(Number(coutCommande) || 0)}
                </span>
            );
        },
    },
    {
        header: 'Statut',
        accessorKey: 'statut',
        cell: ({ row }) => {
            const statut = row.original.statut;
            const statusColor = getStatusColor(statut);
            return (
                <Chip color={statusColor} variant="flat" className="text-sm font-medium px-2 py-0.5 rounded-md">
                    {statut}
                </Chip>
            );
        },
    },
    {
        header: 'Date et heure',
        accessorKey: 'date',
        cell: ({ row }) => {
            const dateString = `${row.original.date}T${row.original.heure}`;
            const date = new Date(dateString);
            return date.toLocaleString();
        },
    },
];
