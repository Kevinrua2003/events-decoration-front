import { Contract, ContractItem } from "@/lib/types";
import axios from "axios";

export async function getContracts(): Promise<Contract[]> {
    
    try {
        const response = await axios.get(`${process.env.BACKEND}/contracts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching contracts:", error);
        return [];
    }
}

export async function createContract(contract: Contract): Promise<Contract> {
    try {
        const { id, ...contractData } = contract;
        const response = await axios.post(`${process.env.BACKEND}/contracts`, contractData);
        return response.data;
    } catch (error) {
        console.error("Error creating contract:", error);
        throw error;
    }
}

export async function deleteContract(id: number): Promise<Contract> {
    try {
        const response = await axios.delete(`${process.env.BACKEND}/contracts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting contract:", error);
        throw error;
    }
}

export async function modifyContract(id: number, contract: Contract): Promise<Contract> {
    try {
        const {id, ...newContract} = contract;
        const response = await axios.patch(`${process.env.BACKEND}/contracts/${id}`, newContract);
        return response.data;
    } catch (error) {
        console.error("Error deleting contract:", error);
        throw error;
    }
}

export async function createContractItem(contractItem: ContractItem): Promise<Event> {
    try {
        const { id, ...contractItemData } = contractItem;
        const response = await axios.post(`${process.env.BACKEND}/contract-items`, contractItemData);
        return response.data;
    } catch (error) {
        console.error("Error creating contract:", error);
        throw error;
    }
}