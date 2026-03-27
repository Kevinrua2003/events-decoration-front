'use server'
import { cache } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import api from './axios';

export const getAuthHeaders = cache(async () => {
  const session = await getServerSession(authOptions);
  return {
    Authorization: session?.backendTokens?.accessToken 
      ? `Bearer ${session.backendTokens.accessToken}` 
      : '',
  };
});

export const getData = cache(async <T>(url: string): Promise<T> => {
  const headers = await getAuthHeaders();
  const response = await api.get<T>(url, { headers });
  return response.data;
});

export const postData = async <T>(url: string, data: unknown): Promise<T> => {
  const headers = await getAuthHeaders();
  const response = await api.post<T>(url, data, { headers });
  return response.data;
};

export const patchData = async <T>(url: string, data: unknown): Promise<T> => {
  const headers = await getAuthHeaders();
  const response = await api.patch<T>(url, data, { headers });
  return response.data;
};

export const deleteData = async <T>(url: string): Promise<T> => {
  const headers = await getAuthHeaders();
  const response = await api.delete<T>(url, { headers });
  return response.data;
};
