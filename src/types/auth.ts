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
