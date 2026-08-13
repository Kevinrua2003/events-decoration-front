import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

let authToken: string | null = null;
let refreshToken: string | null = null;
let interceptorRegistered = false;
let tokenReady: (() => void) | null = null;
let tokenPromise: Promise<void> | null = null;
let refreshing: Promise<boolean> | null = null;

function ensureTokenPromise() {
  if (!tokenPromise) {
    tokenPromise = new Promise<void>((resolve) => {
      tokenReady = resolve;
      // Never hang a request forever if the session never loads.
      setTimeout(resolve, 8000);
    });
  }
}

function setTokens(tokens?: Tokens | null) {
  if (tokens?.accessToken) {
    authToken = tokens.accessToken;
    if (tokens.refreshToken) refreshToken = tokens.refreshToken;
    if (tokenReady) {
      tokenReady();
      tokenReady = null;
      tokenPromise = null;
    }
  }
}

/**
 * Registers the auth interceptors once (idempotent). Call it on every render
 * with the latest session tokens; pending requests wait until a token arrives
 * and 401 responses refresh the access token and retry once.
 */
export function createinterceptor(tokens?: Tokens | null) {
  setTokens(tokens);
  ensureTokenPromise();

  if (!interceptorRegistered) {
    api.interceptors.request.use(async (config) => {
      // Wait for the session tokens before sending so early fetches
      // (useEffect on mount) never fire without Authorization.
      if (tokenPromise) await tokenPromise;
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    });

    api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const original = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };
        if (
          error.response?.status === 401 &&
          original &&
          !original._retry &&
          refreshToken
        ) {
          original._retry = true;
          const refreshed = await doRefresh();
          if (refreshed) {
            original.headers.Authorization = `Bearer ${authToken}`;
            return api(original);
          }
        }
        return Promise.reject(error);
      },
    );

    interceptorRegistered = true;
  }
}

async function doRefresh(): Promise<boolean> {
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { headers: { authorization: `Refresh ${refreshToken}` } },
        );
        setTokens(res.data);
        return true;
      } catch {
        return false;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
}

export default api;