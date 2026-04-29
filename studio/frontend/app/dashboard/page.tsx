"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentThreats } from "@/components/dashboard/recent-threats";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import {
  Shield,
  AlertTriangle,
  Activity,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight retro-title">Dashboard</h2>
        <p className="text-gray-500 retro-mono">
          Welcome to your GuardFlow security dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Threats"
          value="2,847"
          description="All time threats detected"
          icon={AlertTriangle}
          trend={{ value: 12, isPositive: false }}
        />
        <StatsCard
          title="Active Projects"
          value="12"
          description="Projects being monitored"
          icon={Shield}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Blocked Attacks"
          value="1,234"
          description="This month"
          icon={Activity}
          trend={{ value: 23, isPositive: true }}
        />
        <StatsCard
          title="Success Rate"
          value="99.8%"
          description="Threat detection accuracy"
          icon={TrendingUp}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <ActivityChart />
        <RecentThreats />
      </div>
    </div>
  );
}