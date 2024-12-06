import { auth } from '@/auth';
import { redirect } from 'next/navigation';

class ApiClientHost {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async getSession() {
        let session;

        if (typeof window === 'undefined') {
            session = await auth();
        } else {
            const { getSession } = await import('next-auth/react');

            session = await getSession();
        }
        return session;
    }

    private async getHeaders() {
        const session = await this.getSession();

        return {
            Authorization: session?.user?.tokenMember ? `Bearer ${session.user.tokenMember}` : '',
            'Content-Type': 'application/json',
        };
    }

    private async handleResponse(response: Response) {
        if (!response.ok) {
            const session = await this.getSession();
            if (session && response.status === 401) {
                redirect('?member_auth=true');
            }
        }
        return response;
    }

    async fetch(endpoint: string, options: RequestInit = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = await this.getHeaders();

        const response = await fetch(url, {
            ...options,
            headers: { ...headers, ...options.headers },
        });

        return this.handleResponse(response);
    }

    async get(endpoint: string) {
        return this.fetch(endpoint);
    }

    async post(endpoint: string, data: any) {
        return this.fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put(endpoint: string, data: any) {
        return this.fetch(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async patch(endpoint: string, data: any) {
        return this.fetch(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint: string) {
        return this.fetch(endpoint, { method: 'DELETE' });
    }
}

export const apiClientHost = new ApiClientHost(process.env.NEXT_PUBLIC_API_RESTO_URL || '');
