import { auth } from "@/auth";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getHeaders() {
    let session;

    if (typeof window === "undefined") {
      // Côté serveur
      session = await auth();
    } else {
      // Côté client
      const { getSession } = await import("next-auth/react");

      session = await getSession();
    }

    return {
      Authorization: session?.user?.accessToken
        ? `Bearer ${session.user.accessToken}`
        : "",
      "Content-Type": "application/json",
    };
  }

  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    return response;
  }

  async get(endpoint: string) {
    return this.fetch(endpoint);
  }

  async post(endpoint: string, data: any) {
    return this.fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint: string, data: any) {
    return this.fetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.fetch(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || "");
