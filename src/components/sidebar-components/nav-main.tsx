"use client"

import { Landmark, Users, FileText, Settings, Package, ClipboardList } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Produtos",
      url: "#",
      icon: Package,
      items: [
        { title: "Cadastro", url: "/produtos/cadastro" },
      ],
    },
    {
      title: "Ingredientes",
      url: "#",
      icon: Landmark,
      items: [
        { title: "Cadastros", url: "/ingredientes/cadastro" },
        { title: "Consulta", url: "/ingredientes/consulta" },
      ],
    },
    {
      title: "Usuários",
      url: "#",
      icon: Users,
      items: [
        { title: "Cadastro", url: "/usuarios/cadastro" },
        { title: "Consulta", url: "/usuarios/consulta" },
      ],
    },
    {
      title: "Regras",
      url: "#",
      icon: ClipboardList,
      items: [
        { title: "Cadastro", url: "/regras/cadastro" },
        { title: "Consulta", url: "/regras/consulta" },
      ],
    },
    {
      title: "Documentos",
      url: "#",
      icon: FileText,
      items: [
        { title: "Templates", url: "/documentos/templates" },
        { title: "Gerados", url: "/documentos/gerados" },
      ],
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings,
      items: [
        { title: "Geral", url: "/configuracoes/geral" },
      ],
    },
  ],
}

export function NavMain({ items = data.navMain }: { items?: typeof data.navMain }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton render={<a href={item.url} />}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}