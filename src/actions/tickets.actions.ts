import { apiClientHttp } from "@/lib/api-client-http";
import { BonLivraisonVM } from "@/types";
import { PaginatedResponse } from "@/types/models";
import { formatDate } from "@/utils/date-formate";
import { RangeValue } from "@heroui/react";

// Configuration
const BASE_URL = '/api/restaurant';

const ticketsEndpoints = {
    bonLivraisons: { endpoint: (restaurantId: string) => `${BASE_URL}/bon-livraison/${restaurantId}`, method: 'GET' },
    bonLivraisonTerminers: { endpoint: `${BASE_URL}/bon-livraison/tous-termines`, method: 'GET' }
};

export async function getAllBonLivraisons(restaurantId: string, page: number = 0, size: number = 10,
    { dates: { start, end } }: { dates: RangeValue<string | null> }): Promise<PaginatedResponse<BonLivraisonVM>> {
    try {
        const data = await apiClientHttp.request<PaginatedResponse<BonLivraisonVM>>({
            endpoint: ticketsEndpoints.bonLivraisons.endpoint(restaurantId),
            method: ticketsEndpoints.bonLivraisons.method,
            params: {
                page: page.toString(),
                size: size.toString(),
                debut: start ? formatDate(start, 'YYYY-MM-DD') : '',
                fin: end ? formatDate(end, 'YYYY-MM-DD') : '',
                statut: "TERMINER"
            }
        });
        return data;
    } catch (error) {
        return [] as any;
    }
}

export async function getAllBonLivraisonTerminers(restaurantId: string, page: number = 0, size: number = 10,
    { dates: { start, end } }: { dates: RangeValue<string | null> }, typeCommsion: string): Promise<BonLivraisonVM[]> {
    try {
        const data = await apiClientHttp.request<BonLivraisonVM[]>({
            endpoint: ticketsEndpoints.bonLivraisonTerminers.endpoint,
            method: ticketsEndpoints.bonLivraisonTerminers.method,
            params: {
                page: page.toString(),
                size: size.toString(),
                debut: start ? formatDate(start, 'YYYY-MM-DD') : '',
                fin: end ? formatDate(end, 'YYYY-MM-DD') : '',
                type: typeCommsion ?? "",
                restaurantId: restaurantId
            }
        });
        return data;
    } catch (error) {
        return [] as any;
    }
}