import { Product } from "@/lib/types"
import axios from "axios";

export async function getProducts(): Promise<Product[]> {
    try {
        const response = await axios.get(`${process.env.BACKEND}/products`);
        return await response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}