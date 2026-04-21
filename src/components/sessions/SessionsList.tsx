import { useEffect } from 'react';
import { useSessions } from '@/hooks/useSessions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import type { Session } from '@/types/auth';

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(dateString));
}

interface SessionItemProps {
  session: Session;
  onRevoke: (sessionId: string) => void;
  isCurrentSession?: boolean;
}

function SessionItem({ session, onRevoke, isCurrentSession }: SessionItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">
            {session.deviceInfo || 'Dispositivo desconhecido'}
          </span>
          {isCurrentSession && (
            <Badge variant="secondary">
              Atual
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <span>IP: {session.ipAddress || 'N/A'}</span>
          <span>Último uso: {formatDate(session.lastUsedAt)}</span>
        </div>
      </div>
      {!isCurrentSession && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRevoke(session.id)}
          className="text-destructive hover:text-destructive"
        >
          Revogar
        </Button>
      )}
    </div>
  );
}

function SessionsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 py-3">
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-7 w-16" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="flex items-center justify-between gap-4 py-3">
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-36" />
        </div>
        <Skeleton className="h-7 w-16" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="flex items-center justify-between gap-4 py-3">
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-7 w-16" />
      </div>
    </div>
  );
}

interface SessionsListProps {
  currentSessionId?: string;
}

export function SessionsList({ currentSessionId }: SessionsListProps) {
  const { sessions, isLoading, error, fetchSessions, revoke } = useSessions();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRevoke = async (sessionId: string) => {
    try {
      await revoke(sessionId);
    } catch {
      // Error is handled by the hook
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sessões ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <SessionsListSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sessões ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Erro ao carregar sessões</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
          <Button variant="outline" onClick={fetchSessions} className="mt-4">
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sessões ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhuma sessão encontrada.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessões ativas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {sessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              onRevoke={handleRevoke}
              isCurrentSession={session.id === currentSessionId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}