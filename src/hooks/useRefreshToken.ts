import { useCallback, useState } from 'react';
import { refreshToken as apiRefreshToken } from '@/lib/api/auth';

export function useRefreshToken() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await apiRefreshToken();
    } catch (err) {
      const refreshError = err instanceof Error ? err : new Error('Token refresh failed');
      setError(refreshError);
      throw refreshError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { refresh, isLoading, error };
}