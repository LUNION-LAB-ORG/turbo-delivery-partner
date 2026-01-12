import { apiClientHttp } from "@/lib/api-client-http";
import { BonLivraisonTerminee, BonLivraisonVM, ParametreBonLivraisonFacture } from "@/types";
import { PaginatedResponse } from "@/types/models";
import { formatDate } from "@/utils/date-formate";
import { RangeValue } from "@heroui/react";
import axios from "axios";

// Configuration
const BASE_URL = '/api/restaurant';
const BASE_URL_2 = '/api/export/reporting';
const BASE_URL_ERP = '/api/erp/bon-livraison';

const ticketsEndpoints = {
    bonLivraisons: { endpoint: (restaurantId: string) => `${BASE_URL}/bon-livraison/${restaurantId}`, method: 'GET' },
    bonLivraisonTerminers: { endpoint: `${BASE_URL}/bon-livraison/tous-termines`, method: 'GET' },
    bonLivraisonTerminees: { endpoint: `${BASE_URL_ERP}/tous/termines`, method: 'GET' },
    reportingBonLivraison: { endpoint: `${BASE_URL_2}/facture-bon-livraison`, method: "POST" }
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
            },
            service: 'backend',
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
            },
            service: 'backend',
        });
        return data;
    } catch (error) {
        return [] as any;
    }
}

export async function reportingBonLivraisonTerminers(parametre: ParametreBonLivraisonFacture): Promise<ArrayBuffer | null> {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BACKEND_URL}${ticketsEndpoints.reportingBonLivraison.endpoint}`,
            parametre,
            {
                responseType: "arraybuffer",
            }
        );
        return response.data;
    } catch (error) {
        return null;
    }
}

export async function getBonLivraisonTerminees(
    restaurantId: string, page: number, size: number, 
    { dates: { start, end } }: { dates: RangeValue<string | null> })
    : Promise<PaginatedResponse<BonLivraisonTerminee>> {
    try {
        return await apiClientHttp.request<PaginatedResponse<BonLivraisonTerminee>>({
            endpoint: ticketsEndpoints.bonLivraisonTerminees.endpoint,
            method: ticketsEndpoints.bonLivraisonTerminees.method,
            params: {
                debut: start ? formatDate(start, 'YYYY-MM-DD') : '',
                fin: end ? formatDate(end, 'YYYY-MM-DD') : '',
                restaurantId: restaurantId,
                page: page.toString(),
                size: size.toString()
            },
        });
    } catch (error) {
        return [] as any;
    }
}

