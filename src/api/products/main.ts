import { Product } from "@/lib/types"
import api from "@/lib/axios";

export async function getProducts(): Promise<Product[]> {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function getProduct(prodId: number): Promise<Product> {
    try {
        const response = await api.get(`/products/${prodId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}

export async function createProduct(product: Product): Promise<Product> {
    try {
        const { id, ...productData } = product;
        const response = await api.post('/products', productData);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}

export async function deleteProduct(id: number): Promise<Product> {
    try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}
