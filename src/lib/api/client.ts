import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types/auth';
import { refreshToken } from './auth';

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Skip refresh endpoint itself
      if (originalRequest.url === '/auth/refresh') {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        await refreshToken();
        // Access token is now in HttpOnly cookie set by the backend
        // No need to call onTokenRefreshed - the cookie will be sent automatically

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear subscribers and reject
        refreshSubscribers = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

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
