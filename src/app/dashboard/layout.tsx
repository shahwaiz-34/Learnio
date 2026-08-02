import React from "react";
import SideBar from "./components/side-bar"; 
import Header from "./components/header";     

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Main wrapper: full screen height, prevents body scroll
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans text-[#0a0a0b]">
      
      {/* 
        Sidebar Area 
        The SideBar component already handles its own width transitions (w-20 vs w-64)
      */}
      <SideBar />

      {/* 
        Main Content Wrapper 
        Takes up the remaining width (flex-1) and stacks the Header and children vertically
      */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        
        {/* Header Area */}
        <Header />

        {/* 
          Page Content Area 
          Scrolls independently from the Sidebar and Header
        */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          {/* Optional inner wrapper to constrain max width on ultrawide screens */}
          <div className="mx-auto max-w-7xl h-full">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}