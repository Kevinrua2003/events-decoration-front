'use client'
import * as React from "react"
import { ContactRoundIcon, HandIcon, LayoutDashboardIcon, LogOutIcon, PersonStandingIcon, SignalIcon, UserCircle, UsersIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Span from "./Span"

const data = [
    {
      title: "Events Gestion",
      url: "/dashboard/events",
      icon: SignalIcon,
    },
    {
      title: "Our Providers",
      url: "/dashboard/providers",
      icon: HandIcon,
    },
    {
      title: "Our Employees",
      url: "/dashboard/employees",
      icon: UsersIcon,
    },
    {
      title: "Our Clients",
      url: "/dashboard/clients",
      icon: PersonStandingIcon,
    },
    {
      title: "Contracts",
      url: "/dashboard/contracts",
      icon: ContactRoundIcon,
    },
  ]


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const pathName = usePathname();
  const userName = "User"; 

  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-row gap-1">
        <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <UserCircle className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Wellcome {userName}</span>
              </div>
        </SidebarMenuButton>        
      </SidebarHeader>
      <SidebarContent className="gap-1">
        <SidebarMenuItem key={"Dashboard"} className="flex flex-col-1 p-2 gap-1 items-center">
            <LayoutDashboardIcon className="m-0.5"/>
            <SidebarMenuButton asChild isActive={pathName.endsWith("/dashboard")}>                          
              <Link href={"/dashboard"}>{"Main stats"}</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        <Span text={"Administration"} font={"sm"}/>
        {data.map((item) => (
          <SidebarMenuItem key={item.title} className="flex flex-col-1 p-2 gap-1 items-center">
            <item.icon className="m-0.5"/>
            <SidebarMenuButton asChild isActive={pathName.endsWith(item.url)}>                          
              <Link href={item.url}>{item.title}</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}        
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
