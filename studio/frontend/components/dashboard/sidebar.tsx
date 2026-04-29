"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Shield,
  AlertTriangle,
  BarChart3,
  Settings,
  Users,
  FileText,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: Shield },
  { name: "Threats", href: "/threats", icon: AlertTriangle },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white relative z-20">
      <div className="absolute inset-0 halftone-subtle"></div>
      
      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b-2 border-black relative z-10">
        <div className="flex items-center gap-3">
          <div className="retro-card p-2">
            <Shield className="h-6 w-6 text-black" />
          </div>
          <span className="text-xl font-bold retro-title">GuardFlow</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6 relative z-10">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all retro-mono",
                isActive
                  ? "retro-card bg-black text-white"
                  : "hover:bg-gray-50 text-black border-2 border-transparent hover:border-gray-200"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t-2 border-black relative z-10">
        <div className="text-xs text-gray-500 retro-mono text-center">
          v1.0.0 • Retro Mode
        </div>
      </div>
    </div>
  );
}
