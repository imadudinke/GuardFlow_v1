"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FolderKanban, Trash2 } from "lucide-react"
import { ProtectedDashboardPage } from "@/components/dashboard/protected-dashboard-page"
import { ProjectCreateForm } from "@/components/dashboard/project-create-form"
import { Button } from "@/components/ui/button"
import { ApiKeyDisplay } from "@/components/ui/api-key-display"
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
    rotateApiKey,
    setHardBanEnabled,
    deleteProject,
  } = useProjects({ userId: user?.id ?? null })
  const [actionProjectId, setActionProjectId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleCreateProject = async (name: string) => {
    await createProject(name)
  }

  const handleRotateKey = async (projectId: string) => {
    try {
      setActionProjectId(projectId)
      await rotateApiKey(projectId)
    } finally {
      setActionProjectId(null)
    }
  }

  const handleToggleHardBan = async (projectId: string, enabled: boolean) => {
    try {
      setActionProjectId(projectId)
      await setHardBanEnabled(projectId, enabled)
    } finally {
      setActionProjectId(null)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      setActionProjectId(projectId)
      await deleteProject(projectId)
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete project:', error)
      // You could add a toast notification here or set an error state
      alert(`Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setActionProjectId(null)
    }
  }

  return (
    <ProtectedDashboardPage>
      <div className="relative min-h-full overflow-hidden bg-white p-4 text-black sm:p-6 lg:p-8">
        <div className="absolute inset-0 halftone-bg"></div>
        <div className="absolute inset-0 retro-grid"></div>
        
        <div className="relative z-10 space-y-8">
          <header className="retro-card-static bg-white p-4 sm:p-6">
            <div className="absolute inset-0 halftone-accent"></div>
            <div className="relative z-10">
              <p className="mb-2 inline-block retro-card-static bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-[0.35em] retro-mono">
                Project Vault
              </p>
              <h1 className="text-4xl font-black uppercase tracking-[0.08em] text-black retro-title sm:text-5xl">
                Projects
              </h1>
              <p className="mt-3 max-w-2xl retro-mono text-sm text-gray-600">
                Only your projects appear here, and each one keeps its own GuardFlow API key.
              </p>
            </div>
          </header>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="retro-card-static bg-white p-6">
            <div className="absolute inset-0 halftone-subtle"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-black uppercase tracking-[0.08em] retro-title">Your projects</h3>
              <p className="mt-2 text-sm text-gray-600 retro-mono">
                Manage the projects attached to your account.
              </p>
              
              <div className="mt-6 space-y-4">
                {error && (
                  <div className="retro-card-static bg-red-100 px-3 py-2 text-sm font-semibold text-red-800 retro-mono">
                    {error}
                  </div>
                )}

                <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                  {loading ? (
                    <div className="retro-card-static bg-gray-50 p-8 text-center">
                      <div className="absolute inset-0 halftone-subtle"></div>
                      <div className="relative z-10">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-black mx-auto mb-4" />
                        <p className="text-sm font-medium uppercase tracking-[0.12em] text-gray-700 retro-mono">
                          Loading your projects...
                        </p>
                      </div>
                    </div>
                  ) : projects.length === 0 ? (
                  <div className="retro-card-static bg-gray-50 p-8 text-center border-dashed">
                    <div className="absolute inset-0 halftone-subtle"></div>
                    <div className="relative z-10">
                      <FolderKanban className="mx-auto h-10 w-10 text-gray-800" />
                      <h4 className="mt-4 text-lg font-black uppercase tracking-[0.08em] retro-title">No projects yet</h4>
                      <p className="mt-2 text-sm text-gray-600 retro-mono">
                        Create your first project to start ingesting telemetry and viewing threats.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="retro-card bg-white p-4 transition-all duration-200"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-black uppercase tracking-[0.08em] retro-title">{project.name}</h4>
                              <p className="text-xs font-medium text-gray-600 retro-mono">
                                Project ID: {project.id}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="retro-card-static bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] retro-mono text-gray-700">
                                {project.blocked_today} blocked today
                              </span>
                              <span className={`retro-card-static px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] retro-mono ${
                                project.hard_ban_enabled ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                              }`}>
                                {project.hard_ban_enabled ? "Hard Ban Active" : "Log Only"}
                              </span>
                            </div>
                            <ApiKeyDisplay 
                              apiKey={project.api_key} 
                              label="API Key"
                              className="text-sm"
                            />
                          </div>

                          <div className="flex flex-wrap gap-2 sm:gap-3">
                            <Button
                              onClick={() => router.push(`/threats?project=${project.id}`)}
                              type="button"
                              variant="outline"
                              className="retro-button"
                            >
                              View threats
                            </Button>
                            <Button
                              onClick={() => handleRotateKey(project.id)}
                              type="button"
                              disabled={actionProjectId === project.id}
                              className="retro-button"
                            >
                              {actionProjectId === project.id ? "Rotating..." : "Generate New Key"}
                            </Button>
                            <Button
                              onClick={() => handleToggleHardBan(project.id, !project.hard_ban_enabled)}
                              type="button"
                              variant={project.hard_ban_enabled ? "secondary" : "destructive"}
                              disabled={actionProjectId === project.id}
                              className="retro-button"
                            >
                              {actionProjectId === project.id
                                ? "Updating..."
                                : project.hard_ban_enabled
                                ? "Hard Ban Active"
                                : "Log Only Active"}
                            </Button>
                            <Button
                              onClick={() => setDeleteConfirm(project.id)}
                              type="button"
                              variant="destructive"
                              disabled={actionProjectId === project.id}
                              className="retro-button bg-red-100 text-red-800 border-red-800 hover:bg-red-200 flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>

          <ProjectCreateForm
            onCreate={handleCreateProject}
            loading={creating}
            error={createError}
            title="Create a project"
            description="Project ownership is tied to your account automatically."
          />
        </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 p-2 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="relative w-full max-w-md max-h-[calc(100vh-1rem)] overflow-y-auto retro-card-static bg-white p-4 text-black sm:max-h-[85vh] sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 halftone-subtle"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title mb-4">
                Delete Project
              </h3>
              <p className="text-sm retro-mono text-gray-700 mb-6">
                Are you sure you want to delete this project? This action cannot be undone and will permanently remove:
              </p>
              <div className="bg-yellow-50 border-2 border-yellow-200 p-4 mb-6 retro-card-static">
                <ul className="text-sm retro-mono text-yellow-800 space-y-1">
                  <li>• All threat logs and security data</li>
                  <li>• Associated blacklist entries</li>
                  <li>• Project configuration and API keys</li>
                  <li>• Historical analytics and reports</li>
                </ul>
              </div>
              <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                <Button
                  onClick={() => setDeleteConfirm(null)}
                  type="button"
                  variant="outline"
                  className="retro-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteProject(deleteConfirm)}
                  type="button"
                  disabled={actionProjectId === deleteConfirm}
                  className="retro-button bg-red-100 text-red-800 border-red-800 hover:bg-red-200"
                >
                  {actionProjectId === deleteConfirm ? "Deleting..." : "Delete Project"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedDashboardPage>
  )
}
