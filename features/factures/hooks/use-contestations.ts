'use client';

import { useState } from 'react';
import { useContestationsQuery } from '@/features/factures/queries/contestation.query';
import { IContestationSearchParams } from '@/features/factures/types/contestation.types';

interface UseContestationsParams {
    factureId: string;
    enabled?: boolean;
}

export function useContestations({ factureId, enabled = true }: UseContestationsParams) {
    const [page, setPage] = useState(0);
    const [size] = useState(5); // 5 contestations par page

    const searchParams: IContestationSearchParams = {
        factureId,
        page,
        size,
    };

    // La query retourne maintenant toute la PaginatedResponse
    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch
    } = useContestationsQuery(searchParams, enabled);

    const handlePageChange = (newPage: number) => {
        // HeroUI Pagination commence à 1, mais l'API commence à 0
        setPage(newPage - 1);
    };

    return {
        contestations: data?.content || [],
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
        currentPage: page,
        pageSize: size,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
        handlePageChange,
    };
}


