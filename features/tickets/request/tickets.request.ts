import { apiClientHttp } from '@/lib/api-client-http';
import { ITicketParams, ITicketsStats } from '@/features/tickets/types/tickets.type';
import { PaginatedResponse } from '@/types/models';
import { BonLivraisonTerminee } from '@/types';

const BASE_URL = '/api/erp/bon-livraison';

const bonLivraisonEndpoints = {
    bonLivraisonTerminees: { endpoint: `${BASE_URL}/tous/termines`, method: 'GET' },
    stats: { endpoint: `${BASE_URL}/stats`, method: 'GET' },
};

export async function getBonLivraisonRequest(params: ITicketParams): Promise<PaginatedResponse<BonLivraisonTerminee>> {
    console.log('Fetching bon livraison with params:', params);
    return await apiClientHttp.request<PaginatedResponse<BonLivraisonTerminee>>({
        endpoint: bonLivraisonEndpoints.bonLivraisonTerminees.endpoint,
        method: bonLivraisonEndpoints.bonLivraisonTerminees.method,
        params: {
            page: params.page?.toString() || '0',
            size: params.size?.toString() || '10',
            restaurantId: params.restaurantId,
            livreurId: params.livreurId,
            debut: params.debut?.toISOString()?.split('T')?.[0],
            fin: params.fin?.toISOString()?.split('T')?.[0],
            search: params.search,
        },
    });
}

export async function getBonLivraisonStatsRequest(params: ITicketParams) {
    return await apiClientHttp.request<ITicketsStats>({
        endpoint: bonLivraisonEndpoints.stats.endpoint,
        method: bonLivraisonEndpoints.stats.method,
        params: {
            search: params.search,
            restaurantId: params.restaurantId?.trim() || undefined,
            livreurId: params.livreurId?.trim() || undefined,
            debut: params.debut?.toISOString()?.split('T')?.[0],
            fin: params.fin?.toISOString()?.split('T')?.[0],
        },
    });
}
