import { apiClientHttp } from '@/lib/api-client-http';
import { PaginatedResponse } from '@/types/models';
import { IFacture, IFactureDetail, IFactureParams } from '@/features/factures/types/facture.types';
import { createContestationDTO, updateContestationDTO } from '@/features/factures/schemas/contestation.schema';
import {IContestation, IContestationSearchParams} from '@/features/factures/types/contestation.types';

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

export async function obtenirContestationsListRequest(params: IContestationSearchParams): Promise<PaginatedResponse<IContestation>> {
    return await apiClientHttp.request<PaginatedResponse<IContestation>>({
        endpoint: `/api/contestations`,
        method: 'GET',
        params,
    });
}

export async function creerContestationRequest(data: createContestationDTO) {
    return await apiClientHttp.request<IContestation>({
        endpoint: `/api/contestations`,
        method: 'POST',
        data,
    });
}

export async function modifierContestationRequest(id: string, data: updateContestationDTO) {
    return await apiClientHttp.request<IContestation>({
        endpoint: `${BASE_URL}/contestations/${id}`,
        method: 'PUT',
        data,
    });
}

