import axios, { AxiosError } from 'axios';
import { ApiError } from '@/types/auth';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Server responded with a status other than 200
      const data = error.response.data;
      return Promise.reject({
        statusCode: error.response.status,
        message: data.message || 'An error occurred',
        error: data.code || 'UNKNOWN_ERROR',
      });
    }
    // Network error
    return Promise.reject({
      statusCode: 0,
      message: 'Network error. Please check your internet connection',
      error: 'NETWORK_ERROR',
    });
  },
);
