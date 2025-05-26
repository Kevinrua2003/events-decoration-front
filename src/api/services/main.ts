import { Service } from "@/lib/types"
import axios from "axios";

export async function getServices(): Promise<Service[]> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/services`);
        return response.data;
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}

export async function getService(servId: number): Promise<Service> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/services/${servId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching service:", error);
        throw error;
    }
}

export async function createService(service: Service): Promise<Service> {
    try {
        const { id, ...serviceData } = service;
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/services`, serviceData);
        return response.data;
    } catch (error) {
        console.error("Error creating service:", error);
        throw error;
    }
}

export async function deleteService(id: number): Promise<Service> {
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw error;
    }
}