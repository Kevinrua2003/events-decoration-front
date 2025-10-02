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
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { BellIcon, LogOutIcon } from "lucide-react";
import { Noto_Emoji } from "next/font/google";
import { signOut } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const userName = "user";
  const pathName = usePathname();
  const paths = pathName.split("/");

  function logout() {
    router.push("/login");
    Swal.fire({
      title: "Logged out!",
      text: `Good bye ${userName}`,
      icon: "success",
      confirmButtonColor: "black",
      iconColor: "black",
    });
  }

  function formatBreadcrumb(item: string): string {
    const formatted = item.replace(/-/g, " ");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  return (
    <SidebarProvider>
      <AppSidebar className="hidden md:block" />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList>
                <BreadcrumbItem className="md:block">
                  Events gestion
                </BreadcrumbItem>
                {paths.map((item, index) =>
                  index === 0 || item.length === 1 ? null : (
                    <Fragment key={index}>
                      <BreadcrumbSeparator className="md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          {formatBreadcrumb(item)}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </Fragment>
                  )
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex flex-row items-center content-center">
            <div className="flex flex-row border rounded-md border-black p-2 hover:bg-black hover:text-white hover:scale-110 hover:cursor-pointer transition-all duration-200 ease-in-out">
              <BellIcon className="mr-2"/> <div className="flex items-center justify-center h-6 w-3">0</div>
            </div>
            <HoverCard>
              <HoverCardTrigger>
                <div
                  onClick={async () => 
                    // await signOut()         2
                    logout()    //             3
                  }
                  className="flex rounded-md border border-red-500 m-5 gap-1 items-center justify-center hover:scale-110 hover:text-white hover:bg-red-300 hover:cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <div className="flex flex-row m-1 items-center">
                    <LogOutIcon className="text-red-600 m-1" />
                    Log out
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto">
                You will be logged out. Hope you come back
              </HoverCardContent>
            </HoverCard>
          </div>
        </header>
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
  );
}
