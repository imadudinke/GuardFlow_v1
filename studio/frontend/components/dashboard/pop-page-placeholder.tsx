"use client"

import { Button } from "@/components/ui/button"
import { ProtectedDashboardPage } from "@/components/dashboard/protected-dashboard-page"
import { useRouter } from "next/navigation"

interface PopPagePlaceholderProps {
  eyebrow: string
  title: string
  description: string
  accent: "cyan" | "pink" | "yellow"
}

export function PopPagePlaceholder({
  eyebrow,
  title,
  description,
}: PopPagePlaceholderProps) {
  const router = useRouter()

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
                {eyebrow}
              </p>
              <h1 className="text-4xl font-black uppercase tracking-[0.08em] text-black retro-title sm:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl retro-mono text-sm text-gray-600">
                {description}
              </p>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="retro-card-static bg-white p-6 text-black">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-[0.08em] retro-title">Coming Soon</h3>
                <p className="mt-3 text-sm text-gray-600 retro-mono">
                  This section has been given the new GuardFlow visual system and is ready for feature work.
                  The page stays usable instead of dropping into a default 404.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="retro-card-static bg-gray-100 p-4 text-black">
                    <div className="text-[10px] font-black uppercase tracking-[0.28em] retro-mono text-gray-600">Status</div>
                    <div className="mt-1 text-2xl font-black uppercase retro-title">Styled</div>
                  </div>
                  <div className="retro-card-static bg-white p-4 text-black">
                    <div className="text-[10px] font-black uppercase tracking-[0.28em] retro-mono text-gray-600">Surface</div>
                    <div className="mt-1 text-2xl font-black uppercase retro-title">Ready</div>
                  </div>
                  <div className="retro-card-static bg-gray-900 p-4 text-white">
                    <div className="text-[10px] font-black uppercase tracking-[0.28em] retro-mono text-gray-300">Mood</div>
                    <div className="mt-1 text-2xl font-black uppercase retro-title">Pop</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="retro-card-static bg-white p-6 text-black">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-black uppercase tracking-[0.08em] retro-title">Next Stops</h3>
                <p className="mt-2 text-sm text-gray-600 retro-mono">
                  Jump back into the live data views while this module waits for product logic.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button type="button" onClick={() => router.push("/dashboard")} className="retro-button">
                    Back to Dashboard
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push("/threats")} className="retro-button">
                    Open Threat Feed
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedDashboardPage>
  )
}
