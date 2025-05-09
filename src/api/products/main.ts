import { Product } from "@/lib/types"
import axios from "axios";

export async function getProducts(): Promise<Product[]> {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        return await response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}