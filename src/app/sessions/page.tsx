'use client';

import { useState } from 'react';
import {SessionsList} from '@/components/sessions';
import {revokeAllSessions} from '@/lib/api';
import {Button} from '@/components/ui/button';

export default function SessionsPage() {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutAll = async () => {
    if (!confirm('Sair de todos os dispositivos?')) return;

    setIsLoading(true);
    setIsError(false);
    setMessage('');

    try {
      await revokeAllSessions();
      setMessage('Deslogado de todos os dispositivos');
      setIsError(false);
    } catch {
      setMessage('Falha ao deslogar');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciar Sessões</h1>
        <Button
          onClick={handleLogoutAll}
          disabled={isLoading}
          variant="destructive"
        >
          {isLoading ? 'Saindo...' : 'Sair de todos'}
        </Button>
      </div>

      {message && (
        <p className={`text-sm ${isError ? 'text-destructive' : 'text-green-600'}`}>
          {message}
        </p>
      )}

      <SessionsList />
    </div>
  );
}