'use client';

import { useState } from 'react';
import {SessionsList} from '@/components/sessions';
import {revokeAllSessions} from '@/lib/api';
import {Button} from '@/components/ui/button';
import {toast} from 'sonner';

export default function SessionsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutAll = async () => {
    if (!confirm('Sair de todos os dispositivos?')) return;

    setIsLoading(true);

    try {
      await revokeAllSessions();
      toast.success('Deslogado de todos os dispositivos');
    } catch {
      toast.error('Falha ao deslogar');
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

      <SessionsList />
    </div>
  );
}