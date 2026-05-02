"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Mail, Menu, User, UserCircle2 } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/threats": "Threats",
  "/analytics": "Analytics",
  "/reports": "Reports",
  "/team": "Team",
  "/settings": "Settings",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "GuardFlow";
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isProfileOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        event.target instanceof Node &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileOpen]);

  return (
    <header className="flex h-16 items-center justify-between bg-white px-3 sm:px-6 border-b-2 border-black relative z-20">
      <div className="absolute inset-0 halftone-accent"></div>

      <div className="flex items-center gap-3 sm:gap-4 relative z-10 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="retro-button p-2 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <h1 className="text-lg sm:text-2xl font-bold retro-title truncate">
          {title}
        </h1>
      </div>

      <div className="relative z-10" ref={profileMenuRef}>
        <button
          type="button"
          onClick={() => setIsProfileOpen((prev) => !prev)}
          className="retro-button inline-flex items-center gap-2 px-2 py-2 sm:px-3 retro-mono"
          aria-haspopup="menu"
          aria-expanded={isProfileOpen}
          aria-label="Open profile menu"
        >
          <UserCircle2 className="h-5 w-5" />
          <span className="hidden md:inline text-sm font-bold max-w-40 truncate">
            {user?.full_name || "Operator"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {isProfileOpen && (
          <div
            className="absolute right-0 mt-2 w-72 max-w-[85vw] retro-card-static bg-white p-3"
            role="menu"
            aria-label="Profile menu"
          >
            <div className="space-y-2">
              <div className="retro-card-static bg-gray-50 px-3 py-2">
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500 retro-mono">
                  Name
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-black retro-mono">
                  <User className="h-4 w-4" />
                  <span className="truncate">{user?.full_name || "Unnamed Operator"}</span>
                </div>
              </div>

              <div className="retro-card-static bg-gray-50 px-3 py-2">
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500 retro-mono">
                  Email
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-black retro-mono">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{user?.email || "unknown@example.com"}</span>
                </div>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsProfileOpen(false);
                  void logout();
                }}
                className="retro-button mt-1 inline-flex w-full items-center justify-center gap-2 bg-red-100 px-3 py-2 text-sm font-black uppercase tracking-[0.18em] text-red-800 hover:bg-red-200 retro-mono"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
