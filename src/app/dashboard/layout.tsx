"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/ui/hover-card";
import React, { Fragment } from "react";
import { usePathname } from "next/navigation";
import { BellIcon, LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { createinterceptor } from "@/lib/axios";
import { showGoodbyeMessage, injectSwalStyles } from "@/lib/swal-config";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const paths = pathName.split("/");  
  const session = useSession();

  createinterceptor(session.data?.backendTokens.accessToken);
  
  function formatBreadcrumb(item: string): string {
    const formatted = item.replace(/-/g, " ");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  return (
    <SidebarProvider>
      <AppSidebar className="hidden md:block" />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard" className="text-muted-foreground">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {paths.map((item, index) =>
                  index === 0 || item.length === 1 ? null : (
                    <Fragment key={index}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-foreground font-medium">
                          {formatBreadcrumb(item)}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </Fragment>
                  )
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-3">
            <HoverCard>
              <HoverCardTrigger>
                <button 
                  onClick={async () => {
                    injectSwalStyles();
                    const userName = session.data?.user?.name || session.data?.user?.username || 'Usuario';
                    await showGoodbyeMessage(userName);
                    await signOut();
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted transition-colors duration-200 text-sm text-muted-foreground hover:text-foreground"
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto">
                Cerrar sesión
              </HoverCardContent>
            </HoverCard>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
