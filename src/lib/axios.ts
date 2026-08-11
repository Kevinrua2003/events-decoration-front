import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let interceptorRegistered = false;
let authToken: string | null = null;

/**
 * Registers a single request interceptor (idempotent) that attaches the
 * current access token. Call it on every render with the latest token;
 * the interceptor is only created once.
 */
export function createinterceptor(token: string | null | undefined) {
  authToken = token ?? null;

  if (!interceptorRegistered) {
    api.interceptors.request.use((config) => {
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    });
    interceptorRegistered = true;
  }
}

export default api;
