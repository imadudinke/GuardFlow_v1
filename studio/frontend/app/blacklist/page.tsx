"use client";

import { useMemo, useState } from "react";
import { ProtectedDashboardPage } from "@/components/dashboard/protected-dashboard-page";
import { Ban, AlertTriangle, Clock, Eye, Trash2 } from "lucide-react";

// Mock data - in real implementation, this would come from an API
const mockBlacklistEntries = [
  {
    id: "1",
    dna_id: "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
    reason: "bait_path_triggered",
    risk_factors: ["bait_path_triggered", "high_request_velocity"],
    hit_count: 15,
    source_project: "Web App Security",
    created_at: "2026-04-25T10:30:00Z",
    last_seen_at: "2026-04-29T14:22:00Z",
  },
  {
    id: "2", 
    dna_id: "def456ghi789jkl012mno345pqr678stu901vwx234yz567abc",
    reason: "unauthorized_access",
    risk_factors: ["unauthorized_access", "suspicious_user_agent"],
    hit_count: 8,
    source_project: "API Gateway",
    created_at: "2026-04-27T16:45:00Z",
    last_seen_at: "2026-04-28T09:15:00Z",
  },
  {
    id: "3",
    dna_id: "ghi789jkl012mno345pqr678stu901vwx234yz567abc123def",
    reason: "repeat_offender_banned",
    risk_factors: ["repeat_offender_banned", "high_request_velocity", "suspicious_user_agent"],
    hit_count: 23,
    source_project: "E-commerce Site",
    created_at: "2026-04-20T08:20:00Z",
    last_seen_at: "2026-04-29T11:30:00Z",
  },
];

function formatRiskFactor(factor: string) {
  return factor
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getRiskColor(reason: string) {
  const colors = {
    "bait_path_triggered": "bg-red-100 text-red-800 border-red-300",
    "unauthorized_access": "bg-orange-100 text-orange-800 border-orange-300", 
    "repeat_offender_banned": "bg-purple-100 text-purple-800 border-purple-300",
    "global_blacklist_match": "bg-gray-100 text-gray-800 border-gray-300",
  };
  return colors[reason as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-300";
}

export default function BlacklistPage() {
  const [selectedEntry, setSelectedEntry] = useState<typeof mockBlacklistEntries[0] | null>(null);

  const stats = useMemo(() => {
    const totalEntries = mockBlacklistEntries.length;
    const totalHits = mockBlacklistEntries.reduce((sum, entry) => sum + entry.hit_count, 0);
    const activeToday = mockBlacklistEntries.filter(entry => {
      const lastSeen = new Date(entry.last_seen_at);
      const today = new Date();
      return lastSeen.toDateString() === today.toDateString();
    }).length;

    return { totalEntries, totalHits, activeToday };
  }, []);

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
                Global Defense Network
              </p>
              <h1 className="text-4xl font-black uppercase tracking-[0.08em] text-black retro-title sm:text-5xl">
                Blacklist
              </h1>
              <p className="mt-3 max-w-2xl retro-mono text-sm text-gray-600">
                Shared threat intelligence across all projects. DNA fingerprints blocked here are automatically denied access across your entire infrastructure.
              </p>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="retro-card-static bg-white p-4">
              <div className="flex items-center gap-3">
                <Ban className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Total Blocked</div>
                  <div className="text-2xl font-black retro-title text-red-600">{stats.totalEntries}</div>
                </div>
              </div>
            </div>

            <div className="retro-card-static bg-white p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Total Hits</div>
                  <div className="text-2xl font-black retro-title text-orange-600">{stats.totalHits}</div>
                </div>
              </div>
            </div>

            <div className="retro-card-static bg-white p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Active Today</div>
                  <div className="text-2xl font-black retro-title text-green-600">{stats.activeToday}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Blacklist Entries */}
          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-[0.08em] retro-title">Blocked DNA Fingerprints</h2>
            
            {mockBlacklistEntries.map((entry) => (
              <div key={entry.id} className="retro-card-static bg-white p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`retro-card-static px-3 py-1 text-xs font-black uppercase tracking-[0.2em] retro-mono ${getRiskColor(entry.reason)}`}>
                        {formatRiskFactor(entry.reason)}
                      </span>
                      <span className="retro-card-static bg-gray-100 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] retro-mono text-gray-700">
                        {entry.hit_count} hits
                      </span>
                      <span className="text-xs retro-mono text-gray-500">
                        Source: {entry.source_project}
                      </span>
                    </div>

                    <div className="retro-card-static bg-gray-50 p-3">
                      <div className="text-xs font-black uppercase tracking-[0.2em] retro-mono text-gray-600 mb-2">
                        DNA Fingerprint
                      </div>
                      <code className="text-xs retro-mono break-all text-gray-900">
                        {entry.dna_id}
                      </code>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {entry.risk_factors.map((factor) => (
                        <span
                          key={factor}
                          className="retro-card-static bg-gray-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-700 retro-mono"
                        >
                          {formatRiskFactor(factor)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <div className="text-right">
                      <div className="text-xs font-black uppercase tracking-[0.2em] retro-mono text-gray-600">Last Seen</div>
                      <div className="text-sm retro-mono">
                        {new Date(entry.last_seen_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="retro-button bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.2em] retro-mono flex items-center gap-2"
                      >
                        <Eye className="h-3 w-3" />
                        Details
                      </button>
                      <button className="retro-button bg-red-100 text-red-800 border-red-800 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] retro-mono flex items-center gap-2">
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Modal */}
        {selectedEntry && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setSelectedEntry(null)}
          >
            <div
              className="relative max-w-2xl w-full retro-card-static bg-white p-6 text-black max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black uppercase tracking-[0.08em] retro-title">
                    Blacklist Entry Details
                  </h3>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="retro-button bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.2em] retro-mono"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="retro-card-static bg-gray-50 p-3">
                      <div className="text-xs font-black uppercase tracking-[0.2em] retro-mono text-gray-600">Reason</div>
                      <div className="mt-1 text-sm font-bold retro-mono">{formatRiskFactor(selectedEntry.reason)}</div>
                    </div>
                    <div className="retro-card-static bg-gray-50 p-3">
                      <div className="text-xs font-black uppercase tracking-[0.2em] retro-mono text-gray-600">Hit Count</div>
                      <div className="mt-1 text-sm font-bold retro-mono">{selectedEntry.hit_count}</div>
                    </div>
                    <div className="retro-card-static bg-gray-50 p-3">
                      <div className="text-xs font-black uppercase tracking-[0.2em] retro-mono text-gray-600">Source Project</div>
                      <div className="mt-1 text-sm font-bold retro-mono">{selectedEntry.source_project}</div>
                    </div>
                    <div className="retro-card-static bg-gray-50 p-3">
                      <div className="text-xs font-black uppercase tracking-[0.2em] retro-mono text-gray-600">Created</div>
                      <div className="mt-1 text-sm font-bold retro-mono">
                        {new Date(selectedEntry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="retro-card-static bg-gray-900 p-4 text-white">
                    <div className="text-xs font-black uppercase tracking-[0.2em] retro-mono text-gray-300 mb-2">
                      Full DNA Fingerprint
                    </div>
                    <code className="text-sm retro-mono break-all">{selectedEntry.dna_id}</code>
                  </div>

                  <div>
                    <div className="text-sm font-black uppercase tracking-[0.2em] retro-mono text-gray-600 mb-3">
                      Risk Factors ({selectedEntry.risk_factors.length})
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {selectedEntry.risk_factors.map((factor) => (
                        <div key={factor} className="retro-card-static bg-gray-50 p-3">
                          <div className="text-sm font-bold retro-mono">{formatRiskFactor(factor)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedDashboardPage>
  );
}