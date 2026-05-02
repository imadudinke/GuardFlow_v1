"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen overflow-hidden bg-white retro-grid">
      <div className="absolute inset-0 halftone-bg halftone-animated pointer-events-none"></div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      <div className="relative flex flex-1 flex-col overflow-hidden lg:pl-64">
        <Header onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}