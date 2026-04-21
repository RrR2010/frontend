import { api } from './client';
import type {
  LoginResponse,
  SelectTenantResponse,
  CurrentUserResponse,
  RefreshTokenResponse,
  SessionsResponse,
  SessionRevocationResponse,
} from '@/types/auth';

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

/**
 * Refresh access token
 * POST /auth/refresh
 * Returns { }
 * Side effect: Backend sets accessToken cookie as HttpOnly
 */
export async function refreshToken(): Promise<RefreshTokenResponse> {
  const response = await api.post<RefreshTokenResponse>('/auth/refresh');
  return response.data;
}

/**
 * Get all sessions for current user
 * GET /auth/sessions
 * Returns { sessions[] }
 */
export async function getSessions(): Promise<SessionsResponse> {
  const response = await api.get<SessionsResponse>('/auth/sessions');
  return response.data;
}

/**
 * Revoke a specific session
 * DELETE /auth/sessions/:id
 * Returns { sessionId, revokedAt }
 */
export async function revokeSession(sessionId: string): Promise<SessionRevocationResponse> {
  const response = await api.delete<SessionRevocationResponse>(`/auth/sessions/${sessionId}`);
  return response.data;
}

/**
 * Revoke all sessions (logout everywhere)
 * DELETE /auth/sessions
 * Returns { sessionId, revokedAt }
 */
export async function revokeAllSessions(): Promise<SessionRevocationResponse> {
  const response = await api.delete<SessionRevocationResponse>('/auth/sessions');
  return response.data;
}
