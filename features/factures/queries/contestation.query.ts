'use client';

import { useQuery } from '@tanstack/react-query';
import { obtenirContestationsListRequest } from '@/features/factures/requests/factures.request';
import { IContestationSearchParams } from '@/features/factures/types/contestation.types';
import { contestationsKeyQuery } from './index.query';

// Hook pour récupérer la liste paginée des contestations d'une facture
export const useContestationsQuery = (params: IContestationSearchParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: contestationsKeyQuery('list', params),
        queryFn: () => obtenirContestationsListRequest(params),
        enabled: !!params.factureId && enabled,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};


