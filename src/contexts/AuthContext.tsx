'use client'

import {createContext, useContext, useState, useEffect, type ReactNode} from "react";
import {login as apiLogin, selectTenant as apiSelectTenant, logout as apiLogout, getCurrentUser, LoginParams} from "@/lib/api/auth";
import {User, Tenant, LoginResponse, AuthScope} from "@/types/auth";

type AuthContextType = {
  user: User | null
  tenant: Tenant | null
  scope: AuthScope | null
  tenants: Tenant[]
  isAuthenticated: boolean
  isLoading: boolean
  login: (params: LoginParams) => Promise<LoginResponse>
  selectTenant: (tenantId: string) => Promise<void>
  logout: () => Promise<void>
}

const defaultValues: AuthContextType = {
  user: null,
  tenant: null,
  scope: null,
  tenants: [],
  isAuthenticated: false,
  isLoading: true,
  login: async () => {throw new Error('AuthContext not initialized')},
  selectTenant: async () => {throw new Error('AuthContext not initialized')},
  logout: async () => {throw new Error('AuthContext not initialized')},
};

const AuthContext = createContext<AuthContextType>(defaultValues);

export function AuthProvider({children}: {children: ReactNode}){
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [scope, setScope] = useState<AuthScope | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.user);
        setTenant(response.tenant);
        setScope(response.scope);
        setTenants([response.tenant]);
      } catch {
        setUser(null);
        setTenant(null);
        setScope(null);
        setTenants([]);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, [])

  const login = async (params: LoginParams): Promise<LoginResponse> => {
    const response = await apiLogin(params);
    setUser(response.user);
    setScope(response.scope);
    
    // Convert availableContexts.tenants to Tenant format
    const availableTenants = response.availableContexts.tenants || [];
    const tenantsList: Tenant[] = availableTenants.map(tc => ({ id: tc.tenantId, name: tc.tenantName }));
    setTenants(tenantsList);
    
    // Platform user - already authenticated (no tenant selection needed)
    if (response.scope === 'platform') {
      return response;
    }
    
    // Single tenant - auto-select
    if (availableTenants.length === 1) {
      await selectTenant(availableTenants[0].tenantId);
    }
    return response;
  }

  const selectTenant = async (tenantId: string): Promise<void> => {
    await apiSelectTenant({tenantId});
    const selectedTenant = tenants.find(tenant => tenant.id === tenantId);
    setTenant(selectedTenant || null);
  }

  const logout = async (): Promise<void> => {
    await apiLogout();
    setUser(null);
    setTenant(null);
    setScope(null);
    setTenants([]);
  }
  
  const value: AuthContextType = {
    user,
    tenant,
    scope,
    tenants,
    // Authenticated if user exists and either platform scope or tenant selected
    isAuthenticated: !!user && (scope === 'platform' || !!tenant),
    isLoading,
    login,
    selectTenant,
    logout
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}

export function useAuth() {
  return useContext(AuthContext);
}