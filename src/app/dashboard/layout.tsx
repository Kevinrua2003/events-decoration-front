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
import { LogOutIcon } from "lucide-react";
import { Noto_Emoji } from "next/font/google";

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

  function getRoute(index: number): string {
    return "/" + paths.slice(1, index + 1).join("/");
  }
  return (
    <SidebarProvider>
      <AppSidebar className="hidden md:block" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  Events gestion
                </BreadcrumbItem>
                {paths.map((item, index) =>
                  index === 0 ? null : (
                    <Fragment key={index}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbLink href={getRoute(index)}>
                          <BreadcrumbPage>{item}</BreadcrumbPage>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </Fragment>
                  )
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <HoverCard>
            <HoverCardTrigger>
              <div
                onClick={() => logout()}
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
