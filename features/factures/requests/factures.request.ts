import { apiClientHttp } from '@/lib/api-client-http';
import { PaginatedResponse } from '@/types/models';
import { IFacture, IFactureDetail, IFactureParams } from '@/features/factures/types/facture.types';

const BASE_URL = '/api/erp';

export async function obtenirFacturesListRequest(params: IFactureParams): Promise<PaginatedResponse<IFacture>> {
    return await apiClientHttp.request<PaginatedResponse<IFacture>>({
        endpoint: `${BASE_URL}/factures`,
        method: 'GET',
        params: {
            ...params,
            debut: params.periodeDebut?.toISOString()?.split('T')?.[0],
            fin: params.periodeFin?.toISOString()?.split('T')?.[0],
        },
    });
}

export async function obtenirFactureRequest(id: string) {
    return await apiClientHttp.request<IFactureDetail>({
        endpoint: `${BASE_URL}/factures/${id}/details`,
        method: 'GET',
    });
}
