'use server';

import { LivreurDisponible } from '@/types/models';
import { apiClientHttp } from '@/lib/api-client-http';

// Configuration
const BASE_URL = '/api/erp';

const traficEndpoints = {
    getLivreurs: { endpoint: (restaurantId: any) => `${BASE_URL}/gestion-creneau/listelivreurParRestaurant/${restaurantId}`, method: 'GET' },
};

export async function getLivreurs(restaruantId: any): Promise<LivreurDisponible[]> {
    try {
        const data = await apiClientHttp.request<LivreurDisponible[]>({
            endpoint: traficEndpoints.getLivreurs.endpoint(restaruantId),
            method: traficEndpoints.getLivreurs.method,
            service: 'backend',
        });

        return data;
    } catch (error) {
        return [];
    }
}
