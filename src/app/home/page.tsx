"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const { logout } = useAuth()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Seja bem-vindo à Viver Sorvete</h1>
      <Button variant="outline" onClick={() => logout()}>
        Sair
      </Button>
    </div>
  )
}