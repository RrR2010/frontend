import { api } from './client';
import type { LoginResponse, SelectTenantResponse, CurrentUserResponse } from '@/types/auth';

export type LoginParams = {
  email: string;
  password: string;
};

export type SelectTenantParams = {
  tenantId: string;
};

/**
 * Login with email and passowrd
 * POST /auth/login
 * Returns { user, tenants[] }
 * Side effect: Backend sets preAuthToken cookie as HttpOnly
 */
export async function login(params: LoginParams): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', params);
  return response.data;
}

/**
 * Select tenant after login
 * POST /auth/select-tenant
 * Returns { }
 * Side effect: Backend sets accessToken cookie as HttpOnly
 */
export async function selectTenant(params: SelectTenantParams): Promise<SelectTenantResponse> {
  const response = await api.post<SelectTenantResponse>('/auth/select-tenant', params);
  return response.data;
}

/**
 * Logout - clears cookies
 * TODO: implements an endpoint on backend
 */
export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

/**
 * Get current authenticated user
 * GET /auth/me
 * Returns { user, tenant } if token is valid
 * Returns 401 if token is invalid
 */
export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const response = await api.get<CurrentUserResponse>('/auth/me');
  return response.data;
}
