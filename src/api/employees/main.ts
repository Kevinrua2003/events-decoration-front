import { Employee, EmployeeInput } from "@/lib/types";
import api from "@/lib/axios";

export async function getEmployees(): Promise<Employee[]> {
    
    try {
        const response = await api.get('/employees');
        return response.data;
    } catch (error) {
        console.error("Error fetching employees:", error);
        return [];
    }
}

export async function createEmployee(employee: EmployeeInput): Promise<Employee> {
    try {
        const response = await api.post('/auth/register', employee);
        return response.data;
    } catch (error) {
        console.error("Error creating employee:", error);
        throw error;
    }
}

export async function updateEmployee(id: number, employee: Partial<Employee> & { password?: string }): Promise<Employee> {
    try {
        const response = await api.patch(`/employees/${id}`, employee);
        return response.data;
    } catch (error) {
        console.error("Error updating employee:", error);
        throw error;
    }
}

export async function deleteEmployee(id: number): Promise<Employee> {
    try {
        const response = await api.delete(`/employees/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting employee:", error);
        throw error;
    }
}
