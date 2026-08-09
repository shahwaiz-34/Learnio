import React from "react";
import SideBar from "./components/side-bar.tsx";
import Header from "./components/header";
import { SidebarProvider } from "./components/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans text-[#0a0a0b]">
        <SideBar />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
            <div className="mx-auto max-w-7xl h-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}