"use client"

import { ProtectedDashboardPage } from "@/components/dashboard/protected-dashboard-page"
import { useAuth } from "@/contexts/AuthContext"

export default function TeamPage() {
  const { user } = useAuth()

  return (
    <ProtectedDashboardPage>
      <div className="relative min-h-full overflow-hidden bg-white p-8 text-black">
        <div className="absolute inset-0 halftone-bg"></div>
        <div className="absolute inset-0 retro-grid"></div>
        
        <div className="relative z-10 space-y-8">
          <header className="retro-card-static p-6 bg-white">
            <div className="absolute inset-0 halftone-accent"></div>
            <div className="relative z-10">
              <p className="mb-2 inline-block retro-card-static bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-[0.35em] retro-mono">
                Operator Grid
              </p>
              <h1 className="text-4xl font-black uppercase tracking-[0.08em] text-black retro-title sm:text-5xl">
                Team
              </h1>
              <p className="mt-3 max-w-2xl retro-mono text-sm text-gray-600">
                The product is now team-ready at the workspace layer. Full invitations and role
                management can grow from here without redesigning the surface.
              </p>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="retro-card-static bg-white p-6 text-black">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-[0.08em] retro-title">Current Workspace</h3>
                <p className="mt-3 text-sm text-gray-600 retro-mono">
                  This account is currently operating as a private office with a single operator identity.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="retro-card-static bg-white p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.24em] retro-mono text-gray-600">Primary Operator</div>
                    <div className="mt-2 text-lg font-black uppercase retro-title">{user?.full_name || "Solo Operator"}</div>
                  </div>
                  <div className="retro-card-static bg-gray-100 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.24em] retro-mono text-gray-600">Plan</div>
                    <div className="mt-2 text-lg font-black uppercase retro-title">{user?.plan_tier || "Free"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="retro-card-static bg-white p-6 text-black">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-[0.08em] retro-title">Next Team Features</h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  <li className="retro-card-static bg-gray-50 p-3">
                    <span className="retro-mono">Invite teammates into a shared workspace</span>
                  </li>
                  <li className="retro-card-static bg-gray-50 p-3">
                    <span className="retro-mono">Assign roles for read-only, analyst, or admin access</span>
                  </li>
                  <li className="retro-card-static bg-gray-50 p-3">
                    <span className="retro-mono">Split project ownership across security operators</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDashboardPage>
  )
}
