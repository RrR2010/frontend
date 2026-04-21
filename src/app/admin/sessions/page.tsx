'use client';

// TODO: EPIC_005 - Add admin guard:
// import { useAdminGuard } from '@/hooks/useAdminGuard';
// const { hasAccess } = useAdminGuard();
// if (!hasAccess) return <AccessDenied />;

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getUserSessions, revokeUserSession, revokeAllUserSessions, searchUsers } from '@/lib/api/admin';
import type { Session } from '@/types/auth';

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(dateString));
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function AdminSessionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchUsers(searchQuery);
      setUsers(result.users);
    } catch {
      toast.error('Erro ao buscar usuários');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSelectUser = useCallback(async (user: User) => {
    setSelectedUser(user);
    setIsLoadingSessions(true);
    setSessions([]);

    try {
      const result = await getUserSessions(user.id);
      setSessions(result.sessions);
    } catch {
      toast.error('Erro ao carregar sessões');
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  const handleRevokeSession = useCallback(async (sessionId: string) => {
    if (!selectedUser) return;
    if (!confirm('Revogar esta sessão?')) return;

    setIsRevoking(true);
    try {
      await revokeUserSession(selectedUser.id, sessionId);
      toast.success('Sessão revocada');
      // Refresh sessions
      const result = await getUserSessions(selectedUser.id);
      setSessions(result.sessions);
    } catch {
      toast.error('Erro ao revogar sessão');
    } finally {
      setIsRevoking(false);
    }
  }, [selectedUser]);

  const handleRevokeAll = useCallback(async () => {
    if (!selectedUser) return;
    if (!confirm('Revogar TODAS as sessões deste usuário?')) return;

    setIsRevoking(true);
    try {
      await revokeAllUserSessions(selectedUser.id);
      toast.success('Todas as sessões revocadas');
      // Refresh sessions
      const result = await getUserSessions(selectedUser.id);
      setSessions(result.sessions);
    } catch {
      toast.error('Erro ao revogar sessões');
    } finally {
      setIsRevoking(false);
    }
  }, [selectedUser]);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciar Sessões de Usuários</h1>
      </div>

      {/* User Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Usuário</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>

          {/* User Results */}
          {users.length > 0 && (
            <div className="flex flex-col gap-2">
              {users.map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  className="justify-start"
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sessions List Section */}
      {selectedUser && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <CardTitle>Sessões de {selectedUser.name}</CardTitle>
              <span className="text-sm text-muted-foreground">{selectedUser.email}</span>
            </div>
            <Button
              variant="destructive"
              onClick={handleRevokeAll}
              disabled={isRevoking || sessions.length === 0}
            >
              {isRevoking ? 'Revogando...' : 'Revogar Todas'}
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingSessions ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma sessão encontrada.</p>
            ) : (
              <div className="divide-y divide-border">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {session.deviceInfo || 'Dispositivo desconhecido'}
                        </span>
                        {!session.isActive && (
                          <Badge variant="destructive">
                            Inativa
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span>IP: {session.ipAddress || 'N/A'}</span>
                        <span>Criado em: {formatDate(session.createdAt)}</span>
                        <span>Último uso: {formatDate(session.lastUsedAt)}</span>
                      </div>
                    </div>
                    {session.isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={isRevoking}
                        className="text-destructive hover:text-destructive"
                      >
                        Revogar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}