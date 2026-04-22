// Scope types for authentication flow
export type AuthScope = 'platform' | 'tenant';
export type NextStepHint = 'direct-login' | 'select-tenant';

// Available contexts after login
export type AvailableContexts = {
  tenants?: { tenantId: string; tenantName: string }[];
};

export type PlatformRole = 'ADMIN' | 'USER';

export type User = {
  id: string;
  name: string;
  email: string;
  platformRoles: PlatformRole[];
};

export type Tenant = {
  id: string;
  name: string;
};

// Response from /auth/login
export type LoginResponse = {
  user: User;
  scope: AuthScope;
  availableContexts: AvailableContexts;
  nextStepHint: NextStepHint;
};

// Response from /auth/select-tenant
export type SelectTenantResponse = void;

// Response from /auth/me
export type CurrentUserResponse = {
  user: User;
  tenant: Tenant;
  scope: AuthScope;
};

// Error type from backend
export type ApiError = {
  statusCode: number;
  message: string;
  code: string;
};

// Auth state for context (scope-aware)
export type AuthState = {
  user: User | null;
  scope: AuthScope | null;
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

// Session data (minimal - no tokens exposed)
export type Session = {
  id: string;
  deviceInfo?: string;
  ipAddress?: string;
  createdAt: string;
  lastUsedAt: string;
  isActive: boolean;
};

// Response from GET /auth/sessions
export type SessionsResponse = {
  sessions: Session[];
};

// Response from POST /auth/refresh
// Note: accessToken is now set as HttpOnly cookie, not in response body
export type RefreshTokenResponse = {};

// Response from DELETE /auth/sessions/:id
export type SessionRevocationResponse = {
  sessionId: string;
  revokedAt: string;
};