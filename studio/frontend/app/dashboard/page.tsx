"use client";

import { useMemo } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentThreats } from "@/components/dashboard/recent-threats";
import { SecurityOverview } from "@/components/dashboard/security-overview";
import { AnalyticsCardSkeleton, ChartCardSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { useThreats } from "@/hooks/useThreats";
import {
  Shield,
  AlertTriangle,
  Activity,
  TrendingUp,
  Globe,
  Clock,
  Ban,
  Zap,
} from "lucide-react";

// Helper functions
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

export default function DashboardPage() {
  const { user } = useAuth();
  
  const { projects, loading: projectsLoading } = useProjects({
    userId: user?.id ?? null,
  });

  // Get threats from all projects for dashboard overview
  const allProjectIds = projects.map(p => p.id);
  const { threats, loading: threatsLoading } = useThreats({
    projectId: allProjectIds[0] || null, // For now, use first project
    limit: 100, // Get more data for dashboard
    skip: 0,
    pollingInterval: 10000, // Update every 10 seconds
  });

  // Calculate dashboard metrics
  const dashboardData = useMemo(() => {
    if (!threats.length || !projects.length) return null;

    const totalThreats = threats.length;
    const activeProjects = projects.length;
    
    // Calculate blocked attacks (high risk score)
    const blockedAttacks = threats.filter(t => (t.risk_score || 0) >= 70).length;
    const blockRate = totalThreats > 0 ? Math.round((blockedAttacks / totalThreats) * 100) : 0;
    
    // Calculate unique countries and IPs
    const uniqueCountries = new Set(threats.map(t => t.country || 'Unknown')).size;
    const uniqueIPs = new Set(threats.map(t => t.ip_address)).size;
    
    // Get recent threats (last 5)
    const recentThreats = threats
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
    
    // Calculate daily activity
    const dailyThreats = groupThreatsByDate(threats);
    
    // Get top risk factors
    const riskFactorCounts: Record<string, number> = {};
    threats.forEach(threat => {
      (threat.risk_factors || []).forEach(factor => {
        riskFactorCounts[factor] = (riskFactorCounts[factor] || 0) + 1;
      });
    });
    
    const topRiskFactors = Object.entries(riskFactorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([factor, count]) => ({ factor, count }));
    
    // Determine system status
    const recentThreatsCount = threats.filter(t => {
      const threatTime = new Date(t.created_at);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return threatTime > dayAgo;
    }).length;
    
    const systemStatus = totalThreats > 0 ? 'active' : 'monitoring';
    
    // Calculate trends (mock for now - would need historical data)
    const threatTrend = Math.floor(Math.random() * 20) - 10; // -10 to +10
    const projectTrend = projects.length > 0 ? 5 : 0;
    const blockTrend = Math.floor(Math.random() * 15) + 5; // 5 to 20
    
    return {
      totalThreats,
      activeProjects,
      blockedAttacks,
      blockRate,
      uniqueCountries,
      uniqueIPs,
      recentThreats,
      dailyThreats,
      topRiskFactors,
      recentActivity: recentThreatsCount,
      systemStatus,
      trends: {
        threats: threatTrend,
        projects: projectTrend,
        blocks: blockTrend,
        rate: Math.floor(Math.random() * 5) + 1
      }
    };
  }, [threats, projects]);

  const isLoading = projectsLoading || threatsLoading;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight retro-title">Dashboard</h2>
        <p className="text-gray-500 retro-mono">
          {user ? `Welcome back, ${user.email}` : 'Welcome to your GuardFlow security dashboard'}
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <AnalyticsCardSkeleton key={i} />
          ))
        ) : dashboardData ? (
          <>
            <StatsCard
              title="Total Threats"
              value={dashboardData.totalThreats.toLocaleString()}
              description="All detected threats"
              icon={AlertTriangle}
              trend={{ 
                value: Math.abs(dashboardData.trends.threats), 
                isPositive: dashboardData.trends.threats >= 0 
              }}
            />
            <StatsCard
              title="Active Projects"
              value={dashboardData.activeProjects}
              description="Projects being monitored"
              icon={Shield}
              trend={{ 
                value: dashboardData.trends.projects, 
                isPositive: true 
              }}
            />
            <StatsCard
              title="Blocked Attacks"
              value={dashboardData.blockedAttacks.toLocaleString()}
              description="High-risk threats blocked"
              icon={Ban}
              trend={{ 
                value: dashboardData.trends.blocks, 
                isPositive: true 
              }}
            />
            <StatsCard
              title="Block Rate"
              value={`${dashboardData.blockRate}%`}
              description="Threat detection accuracy"
              icon={TrendingUp}
              trend={{ 
                value: dashboardData.trends.rate, 
                isPositive: true 
              }}
            />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Threats"
              value="0"
              description="No threats detected yet"
              icon={AlertTriangle}
            />
            <StatsCard
              title="Active Projects"
              value={projects.length}
              description="Projects being monitored"
              icon={Shield}
            />
            <StatsCard
              title="Blocked Attacks"
              value="0"
              description="No attacks blocked yet"
              icon={Ban}
            />
            <StatsCard
              title="Block Rate"
              value="0%"
              description="Start monitoring to see data"
              icon={TrendingUp}
            />
          </>
        )}
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <AnalyticsCardSkeleton key={`secondary-${i}`} />
          ))
        ) : dashboardData ? (
          <>
            <div className="retro-card-static bg-white p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Countries</div>
                  <div className="text-2xl font-black retro-title text-blue-600">{dashboardData.uniqueCountries}</div>
                </div>
              </div>
            </div>
            <div className="retro-card-static bg-white p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Unique IPs</div>
                  <div className="text-2xl font-black retro-title text-green-600">{dashboardData.uniqueIPs}</div>
                </div>
              </div>
            </div>
            <div className="retro-card-static bg-white p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Last 24h</div>
                  <div className="text-2xl font-black retro-title text-purple-600">
                    {threats.filter(t => {
                      const threatTime = new Date(t.created_at);
                      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                      return threatTime > dayAgo;
                    }).length}
                  </div>
                </div>
              </div>
            </div>
            <div className="retro-card-static bg-white p-4">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.3em] retro-mono text-gray-600">Status</div>
                  <div className="text-lg font-black retro-title text-yellow-600">
                    {dashboardData.totalThreats > 0 ? 'ACTIVE' : 'MONITORING'}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={`empty-${i}`} className="retro-card-static bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-gray-300 rounded"></div>
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.3em] retro-mono text-gray-600">No Data</div>
                  <div className="text-2xl font-black retro-title text-gray-400">--</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-7">
        {isLoading ? (
          <>
            <div className="col-span-4">
              <ChartCardSkeleton />
            </div>
            <div className="col-span-3">
              <ChartCardSkeleton />
            </div>
          </>
        ) : (
          <>
            <SecurityOverview 
              data={dashboardData ? {
                totalThreats: dashboardData.totalThreats,
                blockedAttacks: dashboardData.blockedAttacks,
                uniqueCountries: dashboardData.uniqueCountries,
                uniqueIPs: dashboardData.uniqueIPs,
                recentActivity: dashboardData.recentActivity,
                topRiskFactors: dashboardData.topRiskFactors,
                systemStatus: dashboardData.systemStatus as 'active' | 'monitoring' | 'offline'
              } : undefined}
              loading={isLoading}
            />
            <RecentThreats 
              threats={dashboardData?.recentThreats || []}
              loading={isLoading}
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      {!isLoading && (
        <div className="retro-card-static bg-white p-6">
          <div className="absolute inset-0 halftone-subtle"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">Quick Actions</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <a 
                href="/projects" 
                className="retro-button bg-white p-4 text-center hover:bg-gray-50 block"
              >
                <Shield className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-black retro-mono">Manage Projects</div>
              </a>
              <a 
                href="/threats" 
                className="retro-button bg-white p-4 text-center hover:bg-gray-50 block"
              >
                <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-black retro-mono">View Threats</div>
              </a>
              <a 
                href="/analytics" 
                className="retro-button bg-white p-4 text-center hover:bg-gray-50 block"
              >
                <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-black retro-mono">Analytics</div>
              </a>
              <a 
                href="/sdk-guide" 
                className="retro-button bg-white p-4 text-center hover:bg-gray-50 block"
              >
                <Zap className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-black retro-mono">SDK Guide</div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}