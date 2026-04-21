import { useCallback, useState } from 'react';
import { getSessions, revokeSession as apiRevokeSession, revokeAllSessions as apiRevokeAllSessions } from '@/lib/api/auth';
import type { Session } from '@/types/auth';

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSessions();
      setSessions(response.sessions);
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error('Failed to fetch sessions');
      setError(fetchError);
      throw fetchError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const revoke = useCallback(async (sessionId: string) => {
    setError(null);
    try {
      await apiRevokeSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) {
      const revokeError = err instanceof Error ? err : new Error('Failed to revoke session');
      setError(revokeError);
      throw revokeError;
    }
  }, []);

  const revokeAll = useCallback(async () => {
    setError(null);
    try {
      await apiRevokeAllSessions();
      setSessions([]);
    } catch (err) {
      const revokeError = err instanceof Error ? err : new Error('Failed to revoke all sessions');
      setError(revokeError);
      throw revokeError;
    }
  }, []);

  return { sessions, isLoading, error, fetchSessions, revoke, revokeAll };
}