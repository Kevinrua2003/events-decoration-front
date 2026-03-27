import { Client } from "@/lib/types";
import api from "@/lib/axios";
import { notFound } from "next/navigation";
import Swal from "sweetalert2";

export async function getClients(): Promise<Client[]> {
    
    try {
        const response = await api.get('/clients');
        return response.data;
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error;
    }
}

export async function getClient(clientId: number): Promise<Client> {
    
    try {
        const response = await api.get(`/clients/${clientId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching client:", error);
        throw error;
    }
}

export async function getClientByEmail(email: string): Promise<Client> {
    try {
      const response = await api.get(`/clients/email/${email}`);

      if (!response.data || Object.keys(response.data).length === 0) {
        throw new Error('Client not found');
      }
      
      return response.data;
    } catch (error: any) {
        throw error;
    }
  }
  

export async function createClient(client: Client): Promise<Client> {
    try {
        const { id, ...clientData } = client;
        const response = await api.post('/clients', clientData);
        return response.data;
    } catch (error) {
        console.error("Error creating client:", error);
        throw error;
    }
}

export async function deleteClient(id: number): Promise<Client> {
    try {
        const response = await api.delete(`/clients/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting client:", error);
        throw error;
    }
}

export async function modifyClient(id: number, client: Client): Promise<Client> {
    try {
        const {id, ...newClient} = client;
        const response = await api.patch(`/clients/${id}`, newClient);
        return response.data;
    } catch (error) {
        console.error("Error deleting client:", error);
        throw error;
    }
}
