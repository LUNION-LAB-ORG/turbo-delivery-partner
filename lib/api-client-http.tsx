import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

export type ServiceType = 'erp' | 'restaurant' | 'livreur' | 'client' | 'backend';

let isLoggingOut = false;

const baseUrlMap: Record<ServiceType, string> = {
    erp: process.env.NEXT_PUBLIC_API_ERP_URL!,
    restaurant: process.env.NEXT_PUBLIC_API_RESTO_URL!,
    livreur: process.env.NEXT_PUBLIC_API_DELIVERY_URL!,
    client: process.env.NEXT_PUBLIC_API_CLIENT_URL!,
    backend: process.env.NEXT_PUBLIC_API_BACKEND_URL!,
};

class ApiClientHttp {
    private axiosInstance: AxiosInstance;

    constructor(baseUrl: string) {
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        /**
         * Interceptor RESPONSE
         * Gère proprement les 401 sans boucle infinie
         */
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                if (error.response?.status === 401 && !isLoggingOut) {
                    isLoggingOut = true;

                    try {
                        if (typeof window !== 'undefined') {
                            await fetch('/api/auth/logout', { method: 'POST' });
                        }
                    } finally {
                        if (typeof window !== 'undefined') {
                            window.location.href = '/auth';
                        }
                    }
                }

                return Promise.reject(error);
            },
        );
    }

    /**
     * Injection du token UNE SEULE FOIS (login)
     */
    setAuthToken(token?: string) {
        if (token) {
            this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.axiosInstance.defaults.headers.common['Authorization'];
        }
    }

    /**
     * Requête HTTP générique
     */
    async request<T = any>({
        endpoint,
        method,
        data,
        params,
        service = 'backend',
        config,
    }: {
        endpoint: string;
        method: string;
        data?: any;
        params?: Record<string, any>;
        service?: ServiceType;
        config?: AxiosRequestConfig;
    }): Promise<T> {
        let instance: AxiosInstance;

        if (service) {
            // Pour backend, on n'injecte PAS le token
            if (service === 'backend') {
                instance = axios.create({
                    baseURL: baseUrlMap[service],
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                // Pour tous les autres services, on reprend les headers de l'instance principale
                instance = axios.create({
                    baseURL: baseUrlMap[service],
                    headers: this.axiosInstance.defaults.headers.common,
                });
            }
        } else {
            // Pas de service spécifié : on utilise l'instance par défaut
            instance = this.axiosInstance;
        }

        try {
            // Supprimer les paramètres indéfinis
            if (params) {
                Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);
            }
            const queryString = params ? new URLSearchParams(params).toString() : '';
            const url = `${endpoint.trim()}${queryString ? `?${queryString}` : ''}`;

            switch (method.toLowerCase()) {
                case 'post':
                    return (await instance.post(url, data, config)).data;
                case 'put':
                    return (await instance.put(url, data, config)).data;
                case 'patch':
                    return (await instance.patch(url, data, config)).data;
                case 'delete':
                    return (await instance.delete(url, config)).data;
                default:
                    return (await instance.get(url, config)).data;
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('API Request failed:', {
                    status: error.response?.status,
                    url: error.config?.url,
                    baseUrl: error.config?.baseURL,
                    method: error.config?.method,
                    data: error.response?.data,
                });
            } else {
                console.error('Unknown API error:', error);
            }
            throw error;
        }
    }
}

export const apiClientHttp = new ApiClientHttp(process.env.NEXT_PUBLIC_API_BACKEND_URL || '');
