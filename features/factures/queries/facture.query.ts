'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IFactureParams } from '../types/facture.types';
import { obtenirFactureRequest, obtenirFacturesListRequest } from '@/features/factures/requests/factures.request';

// Clés de query
export const factureKeys = {
    all: ['factures'] as const,
    lists: () => [...factureKeys.all, 'list'] as const,
    list: (params?: IFactureParams) => [...factureKeys.lists(), params] as const,
    details: () => [...factureKeys.all, 'detail'] as const,
    detail: (id: string) => [...factureKeys.details(), id] as const,
    summaries: () => [...factureKeys.all, 'summary'] as const,
    summary: (debut?: string | Date, fin?: string | Date) => [...factureKeys.summaries(), { debut, fin }] as const,
};

// Hook pour récupérer la liste paginée des factures
export const useFacturesQuery = (params: IFactureParams) => {
    return useQuery({
        queryKey: factureKeys.list(params),
        queryFn: () => obtenirFacturesListRequest(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook pour récupérer les détails d'une facture (alias pour plus de clarté)
export const useFactureDetailQuery = (id: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: factureKeys.detail(id),
        queryFn: () => obtenirFactureRequest(id),
        enabled: !!id && enabled,
        staleTime: 5 * 60 * 1000,
    });
};

// Hook pour invalider le cache des factures
export const useInvalidateFacturesQuery = () => {
    const queryClient = useQueryClient();

    return async () => {
        await queryClient.invalidateQueries({ queryKey: factureKeys.all });
    };
};

// Hook pour récupérer le résumé des recouvrements
// export const useFactureSummaryQuery = (debut?: Date, fin?: Date) => {
//   const params = useMemo(() => {
//     const today = new Date();
//     const defaultDebut = formatDate(startOfMonth(today));
//     const defaultFin = formatDate(endOfMonth(today));
//
//     let formatedDebut: string | undefined;
//     let formatedFin: string | undefined;
//     if (debut) {
//       formatedDebut = formatDate(debut);
//     }
//     if (fin) {
//       formatedFin = formatDate(fin);
//     }
//
//     return {
//       debut: formatedDebut || defaultDebut,
//       fin: formatedFin || defaultFin,
//     };
//   }, [debut, fin]);
//
//   return useQuery({
//     queryKey: factureKeys.summary(params.debut, params.fin),
//     queryFn: () => factureAPI.obtenirSummaryRecouvrements(params),
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };
