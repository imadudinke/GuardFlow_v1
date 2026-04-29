"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ThreatLog } from "@/generated/models/ThreatLog";
import { ProtectedDashboardPage } from "@/components/dashboard/protected-dashboard-page";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { useThreats } from "@/hooks/useThreats";
import { countUniqueKnownAttackers, isKnownAttackerThreat } from "@/lib/threat-intel";

const RISK_FACTOR_COPY: Record<string, { label: string; points: number; description: string }> = {
  global_blacklist_match: {
    label: "Global Blacklist Match",
    points: 100,
    description: "This DNA was already convicted by another project and is being blocked from shared memory.",
  },
  bait_path_triggered: {
    label: "Bait Path Triggered",
    points: 100,
    description: "The request touched a trap route that should never be used by real traffic.",
  },
  high_request_velocity: {
    label: "High Request Velocity",
    points: 30,
    description: "The same fingerprint crossed the request-rate threshold too quickly.",
  },
  suspicious_user_agent: {
    label: "Suspicious User Agent",
    points: 20,
    description: "The request advertised an automation-style client fingerprint.",
  },
  unauthorized_access: {
    label: "Unauthorized Access",
    points: 100,
    description: "A protected route was hit without valid credentials attached.",
  },
  repeat_offender_banned: {
    label: "Repeat Offender Ban",
    points: 100,
    description: "The same fingerprint kept hammering traffic until it crossed the ban threshold.",
  },
};

function getRiskTone(score: number) {
  if (score >= 100) {
    return {
      badge: "bg-red-100 text-red-800 border-red-300",
      accent: "text-red-600",
    };
  }

  if (score >= 50) {
    return {
      badge: "bg-orange-100 text-orange-800 border-orange-300",
      accent: "text-orange-600",
    };
  }

  return {
    badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
    accent: "text-yellow-600",
  };
}

function formatFactorName(factor: string) {
  const config = RISK_FACTOR_COPY[factor];
  if (config) {
    return config.label;
  }

  return factor
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function stringifyMetadataValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value === null || value === undefined) {
    return "null";
  }

  return JSON.stringify(value, null, 2);
}

export default function ThreatFeed() {
  const searchParams = useSearchParams();
  const projectFromQuery = searchParams.get("project");
  const { user, isLoading: authLoading } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectFromQuery);
  const [selectedThreat, setSelectedThreat] = useState<ThreatLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Threats per page

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

  const { threats, pagination, loading: threatsLoading, error: threatsError } = useThreats({
    projectId: activeProjectId,
    limit: pageSize,
    skip: (currentPage - 1) * pageSize,
    pollingInterval: 5000, // Poll every 5 seconds
  });

  const knownAttackers = useMemo(() => countUniqueKnownAttackers(threats), [threats]);
  const sharedMemoryHits = useMemo(
    () => threats.filter((threat) => isKnownAttackerThreat(threat)).length,
    [threats],
  );

  // Reset to page 1 when project or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeProjectId, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  useEffect(() => {
    if (!selectedThreat) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedThreat(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedThreat]);

  return (
    <ProtectedDashboardPage>
      <div className="relative min-h-full overflow-hidden bg-white p-8 text-black">
        <div className="absolute inset-0 halftone-bg"></div>
        <div className="absolute inset-0 retro-grid"></div>

        <div className="relative z-10">
          <header className="mb-10 retro-card-static p-6 bg-white">
            <div className="absolute inset-0 halftone-accent"></div>
            <div className="relative z-10">
              <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="mb-2 inline-block retro-card-static bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-[0.35em] retro-mono">
                    Threat Pop Console
                  </p>
                  <h1 className="text-4xl font-black uppercase tracking-[0.08em] text-black retro-title sm:text-5xl">
                    Sentinel Feed
                  </h1>
                  <p className="mt-3 max-w-2xl retro-mono text-sm text-gray-600">
                    Click any DNA fingerprint to open the forensic pop-up with the redacted headers,
                    the trigger stack, and the exact why behind each score.
                  </p>
                </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <div className="retro-card-static bg-white px-4 py-3 text-black">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Intercepted</div>
                  <div className="mt-1 text-2xl font-black retro-title">{pagination?.total ?? threats.length}</div>
                </div>
                <div className="retro-card-static bg-white px-4 py-3 text-black">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Projects</div>
                  <div className="mt-1 text-2xl font-black retro-title">{projects.length}</div>
                </div>
                <div className="retro-card-static bg-white px-4 py-3 text-black">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Known Attackers</div>
                  <div className="mt-1 text-2xl font-black retro-title">{knownAttackers}</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] retro-mono text-gray-500">
                    {sharedMemoryHits} shared hits
                  </div>
                </div>
                <div className="retro-card-static bg-white px-4 py-3 text-black">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Mode</div>
                  <div className="mt-1 text-2xl font-black retro-title">{threatsLoading ? "SYNC" : "LIVE"}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <label className="text-xs font-black uppercase tracking-[0.35em] retro-mono text-gray-600">
                  Project Channel
                </label>

                {authLoading || projectsLoading ? (
                  <div className="retro-card bg-gray-100 px-4 py-2 text-sm text-gray-600 retro-mono min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                      Loading projects...
                    </div>
                  </div>
                ) : projectsError ? (
                  <div className="retro-card bg-red-100 px-4 py-2 text-sm font-semibold text-red-800 retro-mono">
                    Error: {projectsError}
                  </div>
                ) : (
                  <select
                    value={activeProjectId || ""}
                    onChange={(event) => setSelectedProjectId(event.target.value || null)}
                    className="min-w-[220px] retro-card-static bg-white px-4 py-3 text-sm font-bold text-black retro-mono outline-none"
                    disabled={projects.length === 0}
                  >
                    {projects.length === 0 && <option value="">No projects available</option>}
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {threatsLoading && activeProjectId && (
                <div className="inline-flex items-center gap-3 retro-card bg-gray-50 px-4 py-2 text-sm retro-mono text-gray-700">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-black" />
                  Syncing telemetry pulse...
                </div>
              )}
            </div>

            {threatsError && (
              <div className="mt-4 retro-card bg-red-100 px-4 py-3 text-sm font-semibold text-red-800 retro-mono">
                {threatsError}
              </div>
            )}
            </div>
          </header>

          <div className="grid gap-5">
            {!activeProjectId && !projectsLoading && (
              <div className="retro-card bg-gray-50 px-6 py-12 text-center border-dashed">
                <div className="absolute inset-0 halftone-subtle"></div>
                <p className="relative z-10 retro-mono text-sm uppercase tracking-[0.25em] text-gray-600">
                  {projects.length === 0
                    ? "Create a project first to start viewing threats"
                    : "Select a project to view the live threat mural"}
                </p>
              </div>
            )}

            {activeProjectId && threats.length === 0 && !threatsLoading && (
              <div className="retro-card bg-white px-6 py-12 text-center">
                <div className="absolute inset-0 halftone-accent"></div>
                <div className="relative z-10">
                  <p className="text-lg font-black uppercase tracking-[0.2em] text-black retro-title">
                    No threats detected for this project
                  </p>
                  <p className="mt-2 retro-mono text-xs uppercase tracking-[0.25em] text-gray-500">
                    Monitoring remains active and weirdly stylish
                  </p>
                </div>
              </div>
            )}

            <div className={`transition-opacity duration-300 ${threatsLoading ? 'opacity-60' : 'opacity-100'} space-y-5`}>
              {threats.map((threat, index) => {
              const tone = getRiskTone(threat.risk_score);
              const factorCount = threat.risk_factors?.length ?? 0;
              const knownAttacker = isKnownAttackerThreat(threat);

              return (
                <article
                  key={threat.id}
                  className="group relative overflow-hidden retro-card bg-white p-5 hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="absolute inset-0 halftone-subtle"></div>
                  <div
                    className={`absolute right-4 top-4 -rotate-6 retro-card px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] retro-mono bg-gray-100 text-gray-700`}
                  >
                    Case #{String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="retro-card-static bg-white text-black px-3 py-1 text-sm font-black retro-mono border-2 border-black">
                          {threat.ip_address}
                        </span>
                        <span className="retro-card-static bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 retro-mono">
                          {threat.country || "Unknown Origin"}
                        </span>
                        <span className={`text-xs retro-mono uppercase tracking-[0.25em] ${tone.accent}`}>
                          {factorCount} trigger{factorCount === 1 ? "" : "s"}
                        </span>
                        {knownAttacker && (
                          <span className="retro-card-static bg-red-100 text-red-800 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] retro-mono">
                            Known Attacker
                          </span>
                        )}
                      </div>

                      <p className="max-w-2xl border-l-4 border-black pl-4 retro-mono text-sm text-gray-700">
                        {threat.path}
                      </p>

                      <button
                        type="button"
                        onClick={() => setSelectedThreat(threat)}
                        className="inline-flex items-center gap-3 retro-button bg-white px-4 py-2 retro-mono text-xs font-black uppercase tracking-[0.25em] text-black"
                      >
                        <span>DNA</span>
                        <span>{threat.dna_id.slice(0, 16)}...</span>
                        <span className="border-l-2 border-black pl-3">Open Intel</span>
                      </button>

                      <div className="flex flex-wrap gap-2">
                        {(threat.risk_factors && threat.risk_factors.length > 0 ? threat.risk_factors : ["signal_pending"]).map(
                          (factor) => (
                            <span
                              key={`${threat.id}-${factor}`}
                              className="retro-card-static bg-gray-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-700 retro-mono"
                            >
                              {factor === "signal_pending" ? "Signal Pending" : formatFactorName(factor)}
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 text-left lg:items-end lg:text-right">
                      <div className={`retro-card-static px-4 py-3 text-center ${tone.badge}`}>
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] retro-mono">Threat Score</div>
                        <div className="text-3xl font-black retro-title">{threat.risk_score}%</div>
                      </div>
                      <p className="retro-mono text-[11px] uppercase tracking-[0.25em] text-gray-500">
                        {new Date(threat.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
            </div>
          </div>

          {/* Pagination Controls */}
          {pagination && (
            <div className="mt-8 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <PaginationInfo
                    currentPage={pagination.page}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                  />
                  {pagination.total > 5 && (
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-black uppercase tracking-[0.2em] retro-mono text-gray-600">
                        Per page:
                      </label>
                      <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        className="retro-card-static bg-white px-3 py-1 text-sm retro-mono outline-none"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  )}
                </div>
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    hasNext={pagination.hasNext}
                    hasPrev={pagination.hasPrev}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </div>
          )}

        </div>

        {selectedThreat && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setSelectedThreat(null)}
            role="presentation"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="threat-detail-title"
              className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden retro-card bg-white text-black"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute inset-0 halftone-subtle"></div>

              <div className="relative z-10 flex items-center justify-between border-b-2 border-black bg-gray-100 px-6 py-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.35em] retro-mono text-gray-600">Threat Breakdown</p>
                  <h2 id="threat-detail-title" className="text-2xl font-black uppercase tracking-[0.08em] retro-title">
                    DNA {selectedThreat.dna_id.slice(0, 16)}...
                  </h2>
                      {isKnownAttackerThreat(selectedThreat) && (
                        <p className="mt-2 inline-block retro-card bg-red-100 text-red-800 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] retro-mono">
                          Shared blacklist match
                        </p>
                      )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedThreat(null)}
                  className="retro-button bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.2em] retro-mono"
                >
                  Close
                </button>
              </div>

              <div className="relative z-10 grid max-h-[calc(90vh-88px)] gap-6 overflow-y-auto p-6 lg:grid-cols-[1.15fr_0.85fr]">
                <section className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="retro-card bg-white p-3">
                      <div className="text-[10px] font-black uppercase tracking-[0.28em] retro-mono text-gray-600">IP</div>
                      <div className="mt-1 retro-mono text-sm font-bold">{selectedThreat.ip_address}</div>
                    </div>
                    <div className="retro-card bg-white p-3">
                      <div className="text-[10px] font-black uppercase tracking-[0.28em] retro-mono text-gray-600">Country</div>
                      <div className="mt-1 retro-mono text-sm font-bold">{selectedThreat.country}</div>
                    </div>
                    <div className="retro-card bg-white p-3">
                      <div className="text-[10px] font-black uppercase tracking-[0.28em] retro-mono text-gray-600">Risk</div>
                      <div className="mt-1 retro-mono text-sm font-bold">{selectedThreat.risk_score}%</div>
                    </div>
                    <div className="retro-card bg-white p-3">
                      <div className="text-[10px] font-black uppercase tracking-[0.28em] retro-mono text-gray-600">Observed</div>
                      <div className="mt-1 retro-mono text-sm font-bold">
                        {new Date(selectedThreat.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="retro-card bg-gray-900 p-5 text-white">
                    <div className="absolute inset-0 halftone-accent"></div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.35em] retro-mono text-gray-300">
                        Full DNA Fingerprint
                      </p>
                      <p className="mt-3 break-all retro-mono text-sm">{selectedThreat.dna_id}</p>
                      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.35em] retro-mono text-gray-300">
                        Request Path
                      </p>
                      <p className="mt-2 retro-mono text-sm text-gray-100">{selectedThreat.path}</p>
                    </div>
                  </div>

                  <div className="retro-card bg-white p-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title">Redacted Headers</h3>
                        <p className="text-sm text-gray-600 retro-mono">
                          Full request metadata with sensitive values already scrubbed.
                        </p>
                      </div>
                      <span className="retro-card bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] retro-mono">
                        {Object.keys(selectedThreat.metadata ?? {}).length} keys
                      </span>
                    </div>

                    <div className="grid gap-3">
                      {Object.entries(selectedThreat.metadata ?? {})
                        .sort(([left], [right]) => left.localeCompare(right))
                        .map(([key, value]) => (
                          <div key={key} className="retro-card bg-gray-50 p-3">
                            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-600 retro-mono">
                              {key}
                            </div>
                            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap wrap-break-word retro-mono text-xs text-gray-900">
                              {stringifyMetadataValue(value)}
                            </pre>
                          </div>
                        ))}

                      {Object.keys(selectedThreat.metadata ?? {}).length === 0 && (
                        <div className="retro-card bg-gray-100 p-4 text-sm font-medium retro-mono border-dashed">
                          No metadata was captured for this threat event.
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <aside className="space-y-4">
                  <div className="retro-card bg-gray-900 p-5 text-white">
                    <div className="absolute inset-0 halftone-accent"></div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.35em] retro-mono text-gray-300">
                        Why This Score?
                      </p>
                      <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.08em] retro-title">
                        {selectedThreat.risk_score}% risk
                      </h3>
                      <p className="mt-3 text-sm text-gray-300 retro-mono">
                        The score is built from the factors the SDK observed in real time. Each factor adds
                        weight to the final severity.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(selectedThreat.risk_factors && selectedThreat.risk_factors.length > 0
                      ? selectedThreat.risk_factors
                      : ["signal_pending"]
                    ).map((factor) => {
                      const info = RISK_FACTOR_COPY[factor];

                      return (
                        <div
                          key={`${selectedThreat.id}-${factor}`}
                          className="retro-card bg-white p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="text-base font-black uppercase tracking-wider retro-title">
                                {factor === "signal_pending" ? "Signal Pending" : formatFactorName(factor)}
                              </h4>
                              <p className="mt-2 text-sm text-gray-600 retro-mono">
                                {factor === "signal_pending"
                                  ? "This event was recorded before factor explanations were attached."
                                  : info?.description ?? "Custom telemetry factor captured by the studio."}
                              </p>
                            </div>
                            <span className="shrink-0 retro-card bg-gray-100 text-gray-800 px-3 py-1 text-sm font-black retro-mono">
                              {factor === "signal_pending" ? "n/a" : `+${info?.points ?? 0}`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedDashboardPage>
  );
}
