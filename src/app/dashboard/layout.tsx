'use client'
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import React from "react"

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <AppSidebar className="hidden md:block" />
      <SidebarInset>
        <div className="flex w-full flex-1 flex-col gap-4 p-4 md:p-4 h-screen">
          <div className="grid grid-rows-[auto_1fr] gap-4 h-full max-w-screen-2xl mx-auto w-full">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 auto-rows-fr">
              {React.Children.map(children, (child) => (
                <div className="flex-1 min-h-[200px] h-full w-full">
                  {child}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}