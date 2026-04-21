export type User = {
  id: string;
  name: string;
  email: string;
};

export type Tenant = {
  id: string;
  name: string;
};

// Response from /auth/login
export type LoginResponse = {
  user: User;
  tenants: Tenant[];
};

// Response from /auth/select-tenant
export type SelectTenantResponse = void;

// Response from /auth/me
export type CurrentUserResponse = {
  user: User;
  tenant: Tenant;
};

// Error type from backend
export type ApiError = {
  statusCode: number;
  message: string;
  code: string;
};

export type AuthState = {
  user: User | null;
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
export type RefreshTokenResponse = {
  accessToken: string;
  expiresIn: number;
};

// Response from DELETE /auth/sessions/:id
export type SessionRevocationResponse = {
  sessionId: string;
  revokedAt: string;
};
