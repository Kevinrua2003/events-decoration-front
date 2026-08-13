import { Service } from "@/lib/types"
import api from "@/lib/axios";
import { Pagination } from "@/api/events/main";

export async function getServices({ limit, offset }: Pagination = {}): Promise<Service[]> {
    try {
        const response = await api.get('/services', {
            params: { limit, offset },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}

export async function getService(servId: number): Promise<Service> {
    try {
        const response = await api.get(`/services/${servId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching service:", error);
        throw error;
    }
}

export async function createService(service: Service): Promise<Service> {
    try {
        const { id, ...serviceData } = service;
        const response = await api.post('/services', serviceData);
        return response.data;
    } catch (error) {
        console.error("Error creating service:", error);
        throw error;
    }
}

export async function deleteService(id: number): Promise<Service> {
    try {
        const response = await api.delete(`/services/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw error;
    }
}
