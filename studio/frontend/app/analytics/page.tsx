"use client";

import { useMemo, useState } from "react";
import { ProtectedDashboardPage } from "@/components/dashboard/protected-dashboard-page";
import { AnalyticsCardSkeleton, ChartCardSkeleton, ActivityChartSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { useThreats } from "@/hooks/useThreats";
import { Globe, Shield, TrendingUp, AlertTriangle, MapPin, Clock, Target, BarChart3 } from "lucide-react";

// Helper functions for analytics calculations
function groupThreatsByDate(threats: any[]) {
  const groups: Record<string, number> = {};
  
  // Get last 7 days
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    groups[dateStr] = 0;
  }
  
  // Count threats by date
  threats.forEach(threat => {
    const date = new Date(threat.created_at).toISOString().split('T')[0];
    if (groups.hasOwnProperty(date)) {
      groups[date]++;
    }
  });
  
  return groups;
}

function groupThreatsByCountry(threats: any[]) {
  const groups: Record<string, number> = {};
  threats.forEach(threat => {
    const country = threat.country || 'Unknown';
    groups[country] = (groups[country] || 0) + 1;
  });
  return Object.entries(groups)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
}

function groupThreatsByRiskScore(threats: any[]) {
  const groups = { low: 0, medium: 0, high: 0, critical: 0 };
  threats.forEach(threat => {
    const score = threat.risk_score || 0;
    if (score >= 90) groups.critical++;
    else if (score >= 70) groups.high++;
    else if (score >= 40) groups.medium++;
    else groups.low++;
  });
  return groups;
}

function groupThreatsByPath(threats: any[]) {
  const groups: Record<string, number> = {};
  threats.forEach(threat => {
    const path = threat.path || '/';
    groups[path] = (groups[path] || 0) + 1;
  });
  return Object.entries(groups)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);
}

function getTopRiskFactors(threats: any[]) {
  const factors: Record<string, number> = {};
  threats.forEach(threat => {
    (threat.risk_factors || []).forEach((factor: string) => {
      factors[factor] = (factors[factor] || 0) + 1;
    });
  });
  return Object.entries(factors)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  const { projects, loading: projectsLoading } = useProjects({
    userId: user?.id ?? null,
  });

  const activeProjectId = useMemo(() => {
    if (selectedProjectId && projects.some(p => p.id === selectedProjectId)) {
      return selectedProjectId;
    }
    return projects[0]?.id ?? null;
  }, [projects, selectedProjectId]);

  // Fetch all threats for analytics (no pagination limit)
  const { threats, loading: threatsLoading } = useThreats({
    projectId: activeProjectId,
    limit: 1000, // Get more data for analytics
    skip: 0,
    pollingInterval: 30000, // Less frequent polling for analytics
  });

  // Calculate analytics data
  const analytics = useMemo(() => {
    if (!threats.length) return null;

    const dailyThreats = groupThreatsByDate(threats);
    const topCountries = groupThreatsByCountry(threats);
    const riskDistribution = groupThreatsByRiskScore(threats);
    const topPaths = groupThreatsByPath(threats);
    const topFactors = getTopRiskFactors(threats);

    const totalThreats = threats.length;
    const blockedThreats = threats.filter(t => (t.risk_score || 0) >= 70).length;
    const uniqueIPs = new Set(threats.map(t => t.ip_address)).size;
    const uniqueCountries = new Set(threats.map(t => t.country || 'Unknown')).size;

    return {
      overview: {
        totalThreats,
        blockedThreats,
        uniqueIPs,
        uniqueCountries,
        blockRate: totalThreats > 0 ? Math.round((blockedThreats / totalThreats) * 100) : 0,
      },
      dailyThreats,
      topCountries,
      riskDistribution,
      topPaths,
      topFactors,
    };
  }, [threats]);

  return (
    <ProtectedDashboardPage>
      <div className="relative min-h-full overflow-hidden bg-white p-8 text-black">
        <div className="absolute inset-0 halftone-bg"></div>
        <div className="absolute inset-0 retro-grid"></div>

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <header className="retro-card-static p-6 bg-white">
            <div className="absolute inset-0 halftone-accent"></div>
            <div className="relative z-10">
              <p className="mb-2 inline-block retro-card-static bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-[0.35em] retro-mono">
                Pattern Chamber
              </p>
              <h1 className="text-4xl font-black uppercase tracking-[0.08em] text-black retro-title sm:text-5xl">
                Analytics
              </h1>
              <p className="mt-3 max-w-2xl retro-mono text-sm text-gray-600">
                Deep-dive charts and historical pattern analysis for threat intelligence and security insights.
              </p>
            </div>
          </header>

          {/* Project Selector */}
          <div className="flex items-center gap-4 relative z-30">
            <label className="text-xs font-black uppercase tracking-[0.35em] retro-mono text-gray-600">
              Project Channel
            </label>
            {projectsLoading ? (
              <div className="retro-card-static bg-gray-100 px-4 py-2 text-sm text-gray-600 retro-mono min-w-[220px]">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                  Loading projects...
                </div>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={activeProjectId || ""}
                  onChange={(e) => setSelectedProjectId(e.target.value || null)}
                  className="min-w-[220px] retro-card-static bg-white px-4 py-3 text-sm font-bold text-black retro-mono outline-none cursor-pointer relative z-20 appearance-none"
                  disabled={projects.length === 0}
                  style={{ pointerEvents: 'auto' }}
                >
                  {projects.length === 0 && <option value="">No projects available</option>}
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {!activeProjectId ? (
            <div className="retro-card bg-gray-50 px-6 py-12 text-center border-dashed">
              <div className="absolute inset-0 halftone-subtle"></div>
              <p className="relative z-10 retro-mono text-sm uppercase tracking-[0.25em] text-gray-600">
                {projects.length === 0
                  ? "Create a project first to view analytics"
                  : "Select a project to view analytics"}
              </p>
            </div>
          ) : threatsLoading ? (
            <div className="space-y-8">
              {/* Overview Stats Skeleton */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <AnalyticsCardSkeleton key={i} />
                ))}
              </div>

              {/* Charts Grid Skeleton */}
              <div className="grid gap-6 lg:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ChartCardSkeleton key={i} />
                ))}
              </div>

              {/* Activity Chart Skeleton */}
              <ActivityChartSkeleton />
            </div>
          ) : !analytics ? (
            <div className="retro-card bg-white px-6 py-12 text-center">
              <div className="absolute inset-0 halftone-accent"></div>
              <div className="relative z-10">
                <BarChart3 className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-4 text-lg font-black uppercase tracking-[0.2em] text-black retro-title">
                  No Data Available
                </p>
                <p className="mt-2 retro-mono text-xs uppercase tracking-[0.25em] text-gray-500">
                  Start sending telemetry to see analytics
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Overview Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="retro-card-static bg-white p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Total Threats</div>
                      <div className="text-2xl font-black retro-title">{analytics.overview.totalThreats}</div>
                    </div>
                  </div>
                </div>

                <div className="retro-card-static bg-white p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Blocked</div>
                      <div className="text-2xl font-black retro-title text-red-600">{analytics.overview.blockedThreats}</div>
                    </div>
                  </div>
                </div>

                <div className="retro-card-static bg-white p-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Unique IPs</div>
                      <div className="text-2xl font-black retro-title text-blue-600">{analytics.overview.uniqueIPs}</div>
                    </div>
                  </div>
                </div>

                <div className="retro-card-static bg-white p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Countries</div>
                      <div className="text-2xl font-black retro-title text-green-600">{analytics.overview.uniqueCountries}</div>
                    </div>
                  </div>
                </div>

                <div className="retro-card-static bg-white p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Block Rate</div>
                      <div className="text-2xl font-black retro-title text-purple-600">{analytics.overview.blockRate}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Top Countries */}
                <div className="retro-card-static bg-white p-6">
                  <div className="absolute inset-0 halftone-subtle"></div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">Top Countries</h3>
                    <div className="space-y-3">
                      {analytics.topCountries.map(([country, count], index) => (
                        <div key={country} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="retro-card-static bg-gray-100 px-2 py-1 text-xs font-black retro-mono">
                              #{index + 1}
                            </span>
                            <span className="text-sm font-bold retro-mono">{country}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-20 bg-gray-200 h-2 retro-card-static">
                              <div 
                                className="h-full bg-black" 
                                style={{ width: `${(count / analytics.topCountries[0][1]) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-black retro-mono w-8 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Risk Distribution */}
                <div className="retro-card-static bg-white p-6">
                  <div className="absolute inset-0 halftone-subtle"></div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">Risk Distribution</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold retro-mono text-red-600">Critical (90-100%)</span>
                        <span className="text-sm font-black retro-mono">{analytics.riskDistribution.critical}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold retro-mono text-orange-600">High (70-89%)</span>
                        <span className="text-sm font-black retro-mono">{analytics.riskDistribution.high}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold retro-mono text-yellow-600">Medium (40-69%)</span>
                        <span className="text-sm font-black retro-mono">{analytics.riskDistribution.medium}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold retro-mono text-green-600">Low (0-39%)</span>
                        <span className="text-sm font-black retro-mono">{analytics.riskDistribution.low}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Attack Paths */}
                <div className="retro-card-static bg-white p-6">
                  <div className="absolute inset-0 halftone-subtle"></div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">Top Attack Paths</h3>
                    <div className="space-y-3">
                      {analytics.topPaths.map(([path, count], index) => (
                        <div key={path} className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="retro-card-static bg-gray-100 px-2 py-1 text-xs font-black retro-mono shrink-0">
                              #{index + 1}
                            </span>
                            <code className="text-xs retro-mono break-all">{path}</code>
                          </div>
                          <span className="text-sm font-black retro-mono shrink-0">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Risk Factors */}
                <div className="retro-card-static bg-white p-6">
                  <div className="absolute inset-0 halftone-subtle"></div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">Top Risk Factors</h3>
                    <div className="space-y-3">
                      {analytics.topFactors.map(([factor, count], index) => (
                        <div key={factor} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="retro-card-static bg-gray-100 px-2 py-1 text-xs font-black retro-mono">
                              #{index + 1}
                            </span>
                            <span className="text-sm font-bold retro-mono">
                              {factor.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </span>
                          </div>
                          <span className="text-sm font-black retro-mono">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Activity Timeline */}
              <div className="retro-card-static bg-white p-6">
                <div className="absolute inset-0 halftone-subtle"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title">Recent Activity (Last 7 Days)</h3>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-7">
                    {Object.entries(analytics.dailyThreats)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([date, count]) => {
                        const maxCount = Math.max(...Object.values(analytics.dailyThreats), 1);
                        const height = Math.max((count / maxCount) * 80, 4);
                        return (
                          <div key={date} className="text-center">
                            <div className="retro-card-static bg-gray-100 p-2 mb-2 h-20 flex items-end justify-center">
                              <div 
                                className="w-full bg-black retro-card-static min-h-[4px]" 
                                style={{ height: `${height}%` }}
                              />
                            </div>
                            <div className="text-xs font-black retro-mono">{count}</div>
                            <div className="text-[10px] retro-mono text-gray-600">
                              {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  {Object.values(analytics.dailyThreats).every(count => count === 0) && (
                    <div className="text-center py-8">
                      <p className="text-sm retro-mono text-gray-500">No threats recorded in the last 7 days</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedDashboardPage>
  );
}
