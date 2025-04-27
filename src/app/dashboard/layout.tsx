'use client'
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({children}: {children: React.ReactNode}) {

  return (
    <SidebarProvider>
      <AppSidebar className="hidden md:block" />
      <SidebarInset>
        {/* <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="truncate text-sm md:text-base">{path}</span>
        </header> */}
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}