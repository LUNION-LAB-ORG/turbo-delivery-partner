'use server';

import { LivreurRestau, LivreurDisponible, TraficLivreursResponse } from '@/types/models';
import { apiClientHttp } from '@/lib/api-client-http';

// Configuration
const BASE_URL = '/api/erp';

const traficEndpoints = {
    getLivreurs: { endpoint: (restaurantId: any) => `${BASE_URL}/gestion-creneau/listelivreurParRestaurant/${restaurantId}`, method: 'GET' },
    getTraficDelivers: { endpoint: (restaurantId: any) => `${BASE_URL}/livreur/statut/trafic?restaurantId=${restaurantId}`, method: 'GET' },
    getTraficLivreurs: { endpoint: `${BASE_URL}/trafic/livreur`, method: 'GET' },
};

export async function getLivreurs(restaruantId: any): Promise<LivreurRestau[]> {
    try {
        const data = await apiClientHttp.request<LivreurRestau[]>({
            endpoint: traficEndpoints.getLivreurs.endpoint(restaruantId),
            method: traficEndpoints.getLivreurs.method,
            service: 'backend',
        });

        return data;
    } catch (error) {
        return [];
    }
}

export async function getTraficDelivers(restaurantId: any): Promise<TraficLivreursResponse> {
    try {
        const data = await apiClientHttp.request<TraficLivreursResponse>({
            endpoint: traficEndpoints.getTraficDelivers.endpoint(restaurantId),
            method: traficEndpoints.getTraficDelivers.method,
            service: 'backend',
        });

        return data;
    } catch (error) {
        // retourne un objet vide avec structure correcte si erreur
        return {
            disponibles: { total: 0, liste: [] },
            enActivite: { total: 0, liste: [] },
            indisponibles: { total: 0, liste: [] },
            totalLivreurs: 0,
        };
    }
}


export async function getTraficLivreurs(): Promise<LivreurDisponible[]> {
    try {
        const data = await apiClientHttp.request<LivreurDisponible[]>({
            endpoint: traficEndpoints.getTraficLivreurs.endpoint,
            method: traficEndpoints.getTraficLivreurs.method,
            service: 'backend',
        });

        return data;
    } catch (error) {
        return [];
    }
}
