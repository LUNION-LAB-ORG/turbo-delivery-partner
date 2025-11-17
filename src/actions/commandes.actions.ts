'use server';

import { apiClientHttp } from '@/lib/api-client-http';
import { Order } from '@/types/models';
import { toast } from 'react-toastify';

const BASE_URL = '/api/restaurant';

const commandesExterneEndpoints = {
    rechercherCommandes: {
        endpoint: (params?: {
            restaurantId?: string;
            numeroCommande?: string;
            start?: string;
            end?: string;
            page?: number;
            size?: number;
        }) => {
            let url = `${BASE_URL}/commandes-externe/rechercher-commandes`;
            const query = new URLSearchParams();

            if (params?.restaurantId) query.append('restaurantId', params.restaurantId);
            if (params?.start) query.append('start', params.start);
            if (params?.end) query.append('end', params.end);
            if (params?.page !== undefined) query.append('page', params.page.toString());
            if (params?.size !== undefined) query.append('size', params.size.toString());

            // 👉 si aucun paramètre, on renvoie juste l'url de base
            return query.toString() ? `${url}?${query.toString()}` : url;
        },
        method: 'GET',
    },

    orders: {
        endpoint: (params?: {
            restaurantId?: string;
            page?: number;
            size?: number;
        }) => {
            let url = `${BASE_URL}/commandes-externe/rechercher-commandes`;
            const query = new URLSearchParams();

            if (params?.restaurantId) query.append('restaurantId', params.restaurantId);
            if (params?.page !== undefined) query.append('page', params.page.toString());
            if (params?.size !== undefined) query.append('size', params.size.toString());

            // 👉 si aucun paramètre, on renvoie juste l'url de base
            return query.toString() ? `${url}?${query.toString()}` : url;
        },
        method: 'GET',
    },
};

/* =====================
   Types des réponses API
   ===================== */

export interface Destinataire {
    nomComplet: string | null;
    contact: string;
}

export interface Position {
    longitude: number;
    latitude: number;
}

export interface CommandeExterne {
    id: string;
    libelle: string | null;
    numero: string;
    destinataire: Destinataire;
    lieuRecuperation: Position;
    lieuLivraison: Position;
    modePaiement: string;
    statut: string;
    fraisLivraison: number;
    prix: number;
    livraisonPaye: boolean;
    pieceJointe: string | null;
    zoneId: string;
    zone: string;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
}

export interface PageResponse<T> {
    content: T[];
    pageable: Pageable;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
    numberOfElements: number;
    empty: boolean;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
}

/* =====================
   Service
   ===================== */

export async function rechercherCommandesExterne(params?: {
    restaurantId?: string;
    numeroCommande?: string;
    start?: string;
    end?: string;
    page?: number;
    size?: number;
}): Promise<PageResponse<CommandeExterne> | null> {
    try {
        const data = await apiClientHttp.request<PageResponse<CommandeExterne>>({
            endpoint: commandesExterneEndpoints.rechercherCommandes.endpoint(params),
            method: commandesExterneEndpoints.rechercherCommandes.method,
            service: 'backend',
        });

        return data;
    } catch (error) {
        return null;
    }
}


export async function getOrdersByRestaurantId(restaurantId: string): Promise<PageResponse<Order> | null> {
    try {
        const data = await apiClientHttp.request<PageResponse<Order>>({
            endpoint: `/api/V1/turbo/customer/commande/byRestaurant/${restaurantId}`,
            method: 'GET',
            service: 'client',
        });

        return data;
    } catch (error) {
        return null;
    }
}

export async function accepterCommande(orderId: string): Promise<Order | null> {
    try {
        const data = await apiClientHttp.request<Order>({
            endpoint: `/api/V1/turbo/customer/commande/accepter`,
            method: "PUT",
            service: "client",
            data: { 'orderId': orderId }
        });

        return data;
    } catch (error) {
        console.error("Erreur lors de l'acceptation de la commande :", error);
        return null;
    }
}

export async function annulerCommande(orderId: string): Promise<Order | null> {
    try {
        const data = await apiClientHttp.request<Order>({
            endpoint: `/api/V1/turbo/customer/commande/annuler`,
            method: "PUT",
            service: "client",
            data: { 'orderId': orderId }
        });
        return data;
    } catch (error) {
        console.error("Erreur lors de l'annulation de la commande :", error);
        return null;
    }
}

