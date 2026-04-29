"use client"

import { useRouter } from "next/navigation"
import { FolderKanban, KeyRound } from "lucide-react"
import { ProtectedDashboardPage } from "@/components/dashboard/protected-dashboard-page"
import { ProjectCreateForm } from "@/components/dashboard/project-create-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useProjects } from "@/hooks/useProjects"

export default function ProjectsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const {
    projects,
    loading,
    error,
    creating,
    createError,
    createProject,
  } = useProjects({ userId: user?.id ?? null })

  const handleCreateProject = async (name: string) => {
    await createProject(name)
  }

  return (
    <ProtectedDashboardPage>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Only your projects appear here, and each one keeps its own GuardFlow API key.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Your projects</CardTitle>
              <CardDescription>
                Manage the projects attached to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
                  {error}
                </div>
              )}

              {loading ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Loading your projects...
                </p>
              ) : projects.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                  <FolderKanban className="mx-auto h-10 w-10 text-zinc-400" />
                  <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Create your first project to start ingesting telemetry and viewing threats.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-semibold">{project.name}</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Project ID: {project.id}
                            </p>
                          </div>
                          <div className="rounded-md bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-950">
                            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                              <KeyRound className="h-3.5 w-3.5" />
                              API key
                            </div>
                            <code className="break-all text-xs">{project.api_key}</code>
                          </div>
                        </div>

                        <Button
                          onClick={() => router.push(`/threats?project=${project.id}`)}
                          type="button"
                          variant="outline"
                        >
                          View threats
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <ProjectCreateForm
            onCreate={handleCreateProject}
            loading={creating}
            error={createError}
            title="Create a project"
            description="Project ownership is tied to your account automatically."
          />
        </div>
      </div>
    </ProtectedDashboardPage>
  )
}
