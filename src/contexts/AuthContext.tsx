'use client'

import {createContext, useContext, useState, useEffect, type ReactNode} from "react";
import {login as apiLogin, selectTenant as apiSelectTenant, logout as apiLogout, LoginParams} from "@/lib/api/auth";
import {User, Tenant, LoginResponse} from "@/types/auth";

type AuthContextType = {
  user: User | null
  tenant: Tenant | null
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
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Check for existing cookies/session - for now, assume user is not authenticated
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(false);
  }, [])

  const login = async (params: LoginParams): Promise<LoginResponse> => {
    const response = await apiLogin(params);
    setUser(response.user);
    setTenants(response.tenants);
    
    // Single tenant
    if (response.tenants.length === 1) {
      await selectTenant(response.tenants[0].id);
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
    setTenants([]);
  }
  
  const value: AuthContextType = {
    user,
    tenant,
    tenants,
    isAuthenticated: !!user && !!tenant,
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