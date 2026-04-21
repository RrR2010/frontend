import { api } from './client';
import type { Session } from '@/types/auth';

export type UserSessionsResponse = {
  sessions: Session[];
};

export type UserSearchResponse = {
  users: Array<{
    id: string;
    name: string;
    email: string;
  }>;
};

/**
 * Get all sessions for a specific user
 * GET /admin/users/:userId/sessions
 * Returns { sessions[] }
 */
export async function getUserSessions(userId: string): Promise<UserSessionsResponse> {
  const response = await api.get<UserSessionsResponse>(`/admin/users/${userId}/sessions`);
  return response.data;
}

/**
 * Revoke a specific session for a user
 * DELETE /admin/users/:userId/sessions/:sessionId
 * Returns { sessionId, revokedAt }
 */
export async function revokeUserSession(userId: string, sessionId: string): Promise<{ sessionId: string; revokedAt: string }> {
  const response = await api.delete<{ sessionId: string; revokedAt: string }>(`/admin/users/${userId}/sessions/${sessionId}`);
  return response.data;
}

/**
 * Revoke all sessions for a user
 * DELETE /admin/users/:userId/sessions
 * Returns { sessionId, revokedAt }
 */
export async function revokeAllUserSessions(userId: string): Promise<{ sessionId: string; revokedAt: string }> {
  const response = await api.delete<{ sessionId: string; revokedAt: string }>(`/admin/users/${userId}/sessions`);
  return response.data;
}

/**
 * Search users by email or name
 * GET /admin/users/search?q=query
 * Returns { users[] }
 */
export async function searchUsers(query: string): Promise<UserSearchResponse> {
  const response = await api.get<UserSearchResponse>('/admin/users/search', {
    params: { q: query },
  });
  return response.data;
}
