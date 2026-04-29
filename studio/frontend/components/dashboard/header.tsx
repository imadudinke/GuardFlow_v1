"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Bell, LogOut, User } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/threats": "Threats",
  "/analytics": "Analytics",
  "/reports": "Reports",
  "/team": "Team",
  "/settings": "Settings",
};

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "GuardFlow";

  return (
    <header className="flex h-16 items-center justify-between bg-white px-6 border-b-2 border-black relative z-20">
      <div className="absolute inset-0 halftone-accent"></div>
      
      <div className="flex items-center gap-4 relative z-10">
        <h1 className="text-2xl font-bold retro-title">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4 relative z-10">
        <button className="retro-button p-2 retro-mono">
          <Bell className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-3 border-l-2 border-black pl-4">
          <div className="flex items-center gap-3">
            <div className="retro-card p-2">
              <User className="h-4 w-4" />
            </div>
            <div className="text-sm retro-mono">
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="retro-button p-2 retro-mono hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
