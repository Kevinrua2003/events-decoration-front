import { Employee } from "@/lib/types";
import axios from "axios";

export async function getEmployees(): Promise<Employee[]> {
    
    try {
        const response = await axios.get(`${process.env.BACKEND}/employees`);
        return response.data;
    } catch (error) {
        console.error("Error fetching employees:", error);
        return [];
    }
}

export async function createEmployee(employee: Employee): Promise<Event> {
    try {
        const { id, ...employeeData } = employee;
        const response = await axios.post(`${process.env.BACKEND}/employees`, employeeData);
        return response.data;
    } catch (error) {
        console.error("Error creating employee:", error);
        throw error;
    }
}

export async function deleteEmployee(id: number): Promise<Employee> {
    try {
        const response = await axios.delete(`${process.env.BACKEND}/employees/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting employee:", error);
        throw error;
    }
}