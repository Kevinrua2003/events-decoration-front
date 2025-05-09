import { Employee } from "@/lib/types";
import axios from "axios";

export async function getEmployees(): Promise<Employee[]> {
    
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employees`);
        return response.data;
    } catch (error) {
        console.error("Error fetching employees:", error);
        return [];
    }
}

export async function createEmployee(employee: Employee): Promise<Event> {
    try {
        const { id, ...employeeData } = employee;
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/employees`, employeeData);
        return response.data;
    } catch (error) {
        console.error("Error creating employee:", error);
        throw error;
    }
}

export async function deleteEmployee(id: number): Promise<Employee> {
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting employee:", error);
        throw error;
    }
}