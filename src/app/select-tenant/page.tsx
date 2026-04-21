"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectTenantPage() {
  const router = useRouter()
  const { tenants, selectTenant, isAuthenticated, isLoading: authLoading } = useAuth()
  const [selectedTenantId, setSelectedTenantId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/home')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || isAuthenticated) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTenantId) return

    setIsLoading(true)
    try {
      await selectTenant(selectedTenantId)
      router.push("/home")
    } catch (err) {
      console.error("Failed to select tenant:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTenantChange = (value: string | null) => {
    if (value) setSelectedTenantId(value)
  }

  const selectedTenant = tenants.find(t => t.id === selectedTenantId)

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Selecionar Empresa</CardTitle>
            <CardDescription>
              Você possui acesso a mais de uma empresa. Selecione qual deseja acessar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Select value={selectedTenantId} onValueChange={handleTenantChange}>
                  <SelectTrigger>
                    <SelectValue>
                      {selectedTenant?.name || "Selecione uma empresa"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !selectedTenantId}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}