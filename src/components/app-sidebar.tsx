'use client'
import * as React from "react"
import { CalendarIcon, FileText, HandshakeIcon, LayoutDashboardIcon, UserCircleIcon, UsersIcon } from "lucide-react"

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
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <UserCircleIcon className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Decorations</span>
            <span className="text-xs text-muted-foreground capitalize">{session.data?.user?.role || 'Usuario'}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {group.title}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.url || (item.url !== '/dashboard' && pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url} className="flex items-center gap-3 px-4 py-2 text-sm">
                        <item.icon className="h-4 w-4" />
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
      <SidebarRail />
    </Sidebar>
  )
}
