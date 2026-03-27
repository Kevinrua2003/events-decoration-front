import { Provider } from "@/lib/types";
import api from "@/lib/axios";

export async function getProviders(): Promise<Provider[]> {
    
    try {
        const response = await api.get('/providers');
        return response.data;
    } catch (error) {
        console.error("Error fetching providers:", error);
        return [];
    }
}

export async function createProvider(provider: Provider): Promise<Provider> {
    try {
        const { id, ...providerData } = provider;
        const response = await api.post('/providers', providerData);
        return response.data;
    } catch (error) {
        console.error("Error creating provider:", error);
        throw error;
    }
}

export async function deleteProvider(id: number): Promise<Provider> {
    try {
        const response = await api.delete(`/providers/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting provider:", error);
        throw error;
    }
}
