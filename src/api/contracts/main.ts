import { Contract, ContractItem, ContractModifications } from "@/lib/types";
import api from "@/lib/axios";

export async function getContracts(): Promise<Contract[]> {
    
    try {
        const response = await api.get('/contracts');
        return response.data;
    } catch (error) {
        console.error("Error fetching contracts:", error);
        return [];
    }
}

export async function createContract(contract: Contract): Promise<Contract> {
    try {
        const { id, ...contractData } = contract;
        const response = await api.post('/contracts', contractData);
        return response.data;
    } catch (error) {
        console.error("Error creating contract:", error);
        throw error;
    }
}

export async function deleteContract(id: number): Promise<Contract> {
    
    try {
        const response = await api.delete(`/contracts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting contract:", error);
        throw error;
    }
}

export async function modifyContract(id: number, contract: Contract): Promise<Contract> {
    try {
        const {id, ...newContract} = contract;
        const response = await api.patch(`/contracts/${id}`, newContract);
        return response.data;
    } catch (error) {
        console.error("Error deleting contract:", error);
        throw error;
    }
}

export async function getContractItems(): Promise<ContractItem[]> {
    try {
        const response = await api.get('/contract-items');
        return response.data;
    } catch (error) {
        console.error("Error fetching item:", error);
        throw error;
    }
}

export async function createContractItem(contractItem: ContractItem): Promise<Event> {
    try {
        const { id, ...contractItemData } = contractItem;
        const response = await api.post('/contract-items', contractItemData);
        return response.data;
    } catch (error) {
        console.error("Error creating contract:", error);
        throw error;
    }
}

export async function getContractModifications(): Promise<ContractModifications[]> {
    try {
        const response = await api.get('/contract-modifications');
        return response.data;
    } catch (error) {
        console.error("Error fetching modifications:", error);
        throw error;
    }
}
