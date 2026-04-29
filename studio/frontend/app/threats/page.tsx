"use client";

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProtectedDashboardPage } from '@/components/dashboard/protected-dashboard-page';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { useThreats } from '@/hooks/useThreats';

export default function ThreatFeed() {
  const searchParams = useSearchParams();
  const projectFromQuery = searchParams.get("project");
  const { user, isLoading: authLoading } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectFromQuery);

  // Fetch user's projects
  const { projects, loading: projectsLoading, error: projectsError } = useProjects({
    userId: user?.id ?? null,
  });

  const activeProjectId = useMemo(() => {
    if (selectedProjectId && projects.some((project) => project.id === selectedProjectId)) {
      return selectedProjectId;
    }

    return projects[0]?.id ?? null;
  }, [projects, selectedProjectId]);

  const { threats, loading: threatsLoading, error: threatsError } = useThreats({
    projectId: activeProjectId,
    pollingInterval: 5000, // Poll every 5 seconds
  });

  return (
    <ProtectedDashboardPage>
      <div className="min-h-full rounded-xl bg-[#0a0a0a] p-8 text-zinc-300">
        <header className="mb-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white">SENTINEL_FEED</h1>
              <p className="font-mono text-sm text-zinc-500">REAL-TIME THREAT INTELLIGENCE // SYSTEM_ACTIVE</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xl text-cyan-400">{threats.length}</span>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600">Intercepted</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wider text-zinc-500">Project:</label>

            {authLoading || projectsLoading ? (
              <div className="text-sm text-zinc-500">Loading projects...</div>
            ) : projectsError ? (
              <div className="text-sm text-red-500">Error: {projectsError}</div>
            ) : (
              <select
                value={activeProjectId || ''}
                onChange={(event) => setSelectedProjectId(event.target.value || null)}
                className="min-w-[200px] rounded border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-300 focus:border-cyan-500 focus:outline-none"
                disabled={projects.length === 0}
              >
                {projects.length === 0 && (
                  <option value="">No projects available</option>
                )}
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            )}

            {threatsLoading && activeProjectId && (
              <div className="flex items-center gap-2 text-xs text-cyan-500">
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500"></div>
                <span>Syncing...</span>
              </div>
            )}
          </div>

          {threatsError && (
            <div className="mt-4 rounded border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {threatsError}
            </div>
          )}
        </header>

        <div className="grid gap-4">
          {!activeProjectId && !projectsLoading && (
            <div className="py-12 text-center text-zinc-600">
              <p className="font-mono text-sm">
                {projects.length === 0
                  ? "Create a project first to start viewing threats"
                  : "Select a project to view threats"}
              </p>
            </div>
          )}

          {activeProjectId && threats.length === 0 && !threatsLoading && (
            <div className="py-12 text-center text-zinc-600">
              <p className="font-mono text-sm">No threats detected for this project</p>
              <p className="mt-2 font-mono text-xs text-zinc-700">System monitoring active</p>
            </div>
          )}

          {threats.map((threat) => (
            <div
              key={threat.id}
              className="group relative rounded-lg border border-zinc-900 bg-zinc-950 p-5 transition-all hover:border-cyan-900/50"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white">{threat.ip_address}</span>
                    <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] uppercase text-zinc-500">
                      {threat.country || 'Unknown Origin'}
                    </span>
                  </div>
                  <p className="font-mono text-xs italic text-zinc-500">{threat.path}</p>
                  <p className="font-mono text-[10px] text-zinc-700">DNA: {threat.dna_id.slice(0, 16)}...</p>
                </div>

                <div className="text-right">
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      threat.risk_score > 70
                        ? 'border border-red-500/20 bg-red-500/10 text-red-500'
                        : 'border border-cyan-500/20 bg-cyan-500/10 text-cyan-500'
                    }`}
                  >
                    {threat.risk_score}% RISK
                  </div>
                  <p className="mt-2 text-[10px] text-zinc-600">
                    {new Date(threat.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedDashboardPage>
  );
}
