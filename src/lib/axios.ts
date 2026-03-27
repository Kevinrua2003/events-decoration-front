import axios from "axios";
import { useSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export function createinterceptor (token: any) {
  api.interceptors.request.use(async (config) => {
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
}

export default api;
