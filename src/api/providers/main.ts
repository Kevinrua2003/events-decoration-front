import { Provider } from "@/lib/types";
import axios from "axios";

export async function getProviders(): Promise<Provider[]> {
    
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/providers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching providers:", error);
        return [];
    }
}

export async function createProvider(provider: Provider): Promise<Provider> {
    try {
        const { id, ...providerData } = provider;
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/providers`, providerData);
        return response.data;
    } catch (error) {
        console.error("Error creating provider:", error);
        throw error;
    }
}

export async function deleteProvider(id: number): Promise<Provider> {
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/providers/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting provider:", error);
        throw error;
    }
}