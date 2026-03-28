'use client'
import * as React from "react"
import { CalendarIcon, FileText, HandshakeIcon, LayoutDashboardIcon, UserCircleIcon, UsersIcon, Gem } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"

const data = {
  navMain: [
    {
      title: "Principal",
      url: "/dashboard",
      items: [
        {
          title: "Estadísticas",
          url: "/dashboard",
          icon: LayoutDashboardIcon,
        },
      ],
    },
    {
      title: "Administración",
      url: "#",
      items: [
        {
          title: "Eventos",
          url: "/dashboard/events",
          icon: CalendarIcon,
        },
        {
          title: "Proveedores",
          url: "/dashboard/providers",
          icon: HandshakeIcon,
        },
        {
          title: "Empleados",
          url: "/dashboard/employees",
          icon: UsersIcon,
        },
        {
          title: "Clientes",
          url: "/dashboard/clients",
          icon: UserCircleIcon,
        },
        {
          title: "Contratos",
          url: "/dashboard/contracts",
          icon: FileText,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const session = useSession();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#d4af37] via-[#f5d67b] to-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Gem className="h-5 w-5 text-[#0c0c0c]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-serif font-semibold text-[#f5f5f0]" style={{ fontFamily: 'var(--font-playfair)' }}>Decorations</span>
            <span className="text-xs text-[#737373] capitalize">{session.data?.user?.role || 'Usuario'}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="px-4 py-3 text-xs font-medium text-[#737373] uppercase tracking-widest">
              {group.title}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.url || (item.url !== '/dashboard' && pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link 
                        href={item.url} 
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-r from-[#d4af37]/20 to-transparent text-[#d4af37] border-r-2 border-[#d4af37]' 
                            : 'text-[#a3a3a3] hover:text-[#f5f5f0] hover:bg-[#1f1f1f]'
                        }`}
                      >
                        <item.icon className={`h-4 w-4 ${isActive ? 'text-[#d4af37]' : ''}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail className="bg-[#1a1a1a] border-l border-[#2a2a2a]" />
    </Sidebar>
  )
}
