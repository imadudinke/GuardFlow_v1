"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentThreats } from "@/components/dashboard/recent-threats";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { ProjectCreateForm } from "@/components/dashboard/project-create-form";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { useUserThreats } from "@/hooks/useUserThreats";
import {
  Shield,
  AlertTriangle,
  Activity,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    creating,
    createError,
    createProject,
  } = useProjects({ userId: user?.id ?? null });

  const projectIds = useMemo(() => projects.map((project) => project.id), [projects]);
  const {
    threats,
    loading: threatsLoading,
    error: threatsError,
  } = useUserThreats({
    projectIds,
    pollingInterval: 10000,
    limitPerProject: 25,
  });

  const recentThreats = threats.slice(0, 5);
  const blockedThreats = threats.filter((threat) => threat.risk_score >= 75).length;
  const successRate = threats.length === 0
    ? 100
    : Math.round((blockedThreats / threats.length) * 1000) / 10;

  const chartData = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return {
        key: date.toISOString().slice(0, 10),
        day: formatter.format(date),
        threats: 0,
      };
    });

    for (const threat of threats) {
      const key = threat.created_at.slice(0, 10);
      const day = days.find((item) => item.key === key);
      if (day) {
        day.threats += 1;
      }
    }

    return days.map(({ day, threats }) => ({ day, threats }));
  }, [threats]);

  const handleCreateProject = async (name: string) => {
    await createProject(name);
    router.push("/projects");
  };

  const summaryMessage = projectsError || threatsError;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          Monitor only your projects and create new ones as your workspace grows.
        </p>
      </div>

      {summaryMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
          {summaryMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Threats"
          value={threatsLoading ? "..." : threats.length}
          description="Threats recorded across your projects"
          icon={AlertTriangle}
        />
        <StatsCard
          title="Active Projects"
          value={projectsLoading || authLoading ? "..." : projects.length}
          description="Projects you own"
          icon={Shield}
        />
        <StatsCard
          title="Blocked Attacks"
          value={threatsLoading ? "..." : blockedThreats}
          description="High risk events intercepted"
          icon={Activity}
        />
        <StatsCard
          title="Success Rate"
          value={`${successRate}%`}
          description="High risk share of detected threats"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <ProjectCreateForm
          onCreate={handleCreateProject}
          loading={creating}
          error={createError}
          title="Create a new project"
          description="Every project gets its own API key so only your telemetry appears in your workspace."
          submitLabel="Create and manage project"
        />

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold">Project coverage</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {projects.length === 0
              ? "You do not have any projects yet."
              : `You are monitoring ${projects.length} project${projects.length === 1 ? "" : "s"}.`}
          </p>
          <div className="mt-4 space-y-2">
            {projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
              >
                <div className="font-medium">{project.name}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  API key: {project.api_key.slice(0, 18)}...
                </div>
              </div>
            ))}
            {projects.length > 4 && (
              <button
                className="text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
                onClick={() => router.push("/projects")}
                type="button"
              >
                View all projects
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <ActivityChart data={chartData} loading={threatsLoading} />
        <RecentThreats threats={recentThreats} loading={threatsLoading} />
      </div>
    </div>
  );
}
