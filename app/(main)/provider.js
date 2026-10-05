import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_component/AppSidebar";
import Navbar from "./_component/Navbar";
function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main className=" w-full p-4 ">
        <Navbar />

        <div className=" py-4 max-h-[calc(100vh-160px)] overflow-y-auto ">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default DashboardProvider;
