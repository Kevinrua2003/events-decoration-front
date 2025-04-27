import { Service } from "@/lib/types"
import axios from "axios";

export async function getServices(): Promise<Service[]> {
    try {
        const response = await axios.get(`${process.env.BACKEND}/services`);
        return await response.data;
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}