import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React from 'react';
import { IFacture } from '@/features/factures/types/facture.types';
import FacturePdfViewer from '@/components/factures/pdf/facture-pdf-viewer';
import { formatCFA } from '@/features/helpers';

const formatDate = (dateString: string) => {
    try {
        return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch {
        return dateString;
    }
};

// Composant pour les actions de facture
const FactureActions = ({ facture }: { facture: IFacture }) => {
    return <FacturePdfViewer factureId={facture.id} />;
};

export const factureTableColumns: ColumnDef<IFacture>[] = [
    {
        accessorKey: 'code',
        header: 'Référence',
        cell: ({ row }) => <span>{row.original.code}</span>,
    },
    // {
    //   accessorKey: 'type',
    //   header: 'Type',
    //   cell: ({ row }) => <span className="capitalize">{row.original.type}</span>,
    // },
    {
        accessorKey: 'periodeDebut',
        header: 'Période Début',
        cell: ({ row }) => <span className="text-sm">{formatDate(row.original.periodeDebut)}</span>,
    },
    {
        accessorKey: 'periodeFin',
        header: 'Période Fin',
        cell: ({ row }) => <span className="text-sm">{formatDate(row.original.periodeFin)}</span>,
    },
    {
        accessorKey: 'montant',
        header: 'Montant',
        cell: ({ row }) => <span className="font-bold">{formatCFA(row.original.montant || 0)}</span>,
    },
    {
        accessorKey: 'createdAt',
        header: 'Date Création',
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => <FactureActions facture={row.original} />,
        enableSorting: false,
    },
];
