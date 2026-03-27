'use client'
import { useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import api from '@/lib/axios';

export function useApi() {
  const { data: session } = useSession();
  const interceptorAdded = useRef(false);

  useEffect(() => {
    if (interceptorAdded.current) {
      return;
    }

    api.interceptors.request.use((config) => {
      if (session?.backendTokens?.accessToken) {
        config.headers.Authorization = `Bearer ${session.backendTokens.accessToken}`;
      }
      return config;
    });

    interceptorAdded.current = true;
  }, [session]);

  return api;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

import { useState } from 'react';
