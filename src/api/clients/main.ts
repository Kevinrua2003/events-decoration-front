import { Client } from "@/lib/types";
import axios from "axios";
import { notFound } from "next/navigation";
import Swal from "sweetalert2";

export async function getClients(): Promise<Client[]> {
    
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clients`);
        return response.data;
    } catch (error) {
        console.error("Error fetching clients:", error);
        return [];
    }
}

export async function getClientByEmail(email: string): Promise<Client> {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clients/email/${email}`);

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
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, clientData);
        return response.data;
    } catch (error) {
        console.error("Error creating client:", error);
        throw error;
    }
}

export async function deleteClient(id: number): Promise<Client> {
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting client:", error);
        throw error;
    }
}

export async function modifyClient(id: number, client: Client): Promise<Client> {
    try {
        const {id, ...newClient} = client;
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, newClient);
        return response.data;
    } catch (error) {
        console.error("Error deleting client:", error);
        throw error;
    }
}