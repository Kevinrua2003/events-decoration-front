import { Product } from "@/lib/types"
import api from "@/lib/axios";
import { Pagination } from "@/api/events/main";

export async function getProducts({ limit, offset }: Pagination = {}): Promise<Product[]> {
    try {
        const response = await api.get('/products', {
            params: { limit, offset },
        });
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

export async function createProduct(
  product: Pick<Product, 'name' | 'price' | 'providerId'>,
  imageFile?: File,
): Promise<Product> {
    try {
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('price', String(product.price));
        formData.append('providerId', String(product.providerId));
        if (imageFile) formData.append('image', imageFile);
        const response = await api.post('/products', formData);
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
