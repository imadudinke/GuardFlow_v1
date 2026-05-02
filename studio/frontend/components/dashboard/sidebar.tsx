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
  Ban,
  Code,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: Shield },
  { name: "Threats", href: "/threats", icon: AlertTriangle },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Blacklist", href: "/blacklist", icon: Ban },
  { name: "SDK Guide", href: "/sdk-guide", icon: Code },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex h-full w-72 max-w-[85vw] flex-col bg-white transition-transform duration-200 lg:z-20 lg:h-screen lg:w-64 lg:max-w-none lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="absolute inset-0 halftone-subtle"></div>

        <div className="flex h-16 items-center justify-between border-b-2 border-black px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="retro-card p-2">
              <Shield className="h-6 w-6 text-black" />
            </div>
            <span className="text-xl font-bold retro-title">GuardFlow</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="retro-button p-2 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="relative z-10 flex-1 space-y-2 px-4 py-6 overflow-y-auto lg:overflow-y-visible">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
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

        <div className="p-4 border-t-2 border-black relative z-10">
          <div className="text-xs text-gray-500 retro-mono text-center">
            v1.0.0 • Retro Mode
          </div>
        </div>
      </aside>
    </>
  );
}
