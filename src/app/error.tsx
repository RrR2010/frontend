'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-2xl font-bold">Algo deu errado</h2>
      <p className="text-muted-foreground">
        Ocorreu um erro inesperado. Por favor, tente novamente.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">ID: {error.digest}</p>
      )}
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}