"use client"

import { FormEvent, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectCreateFormProps {
  onCreate: (name: string) => Promise<void>
  loading?: boolean
  error?: string | null
  title?: string
  description?: string
  submitLabel?: string
}

export function ProjectCreateForm({
  onCreate,
  loading = false,
  error = null,
  title = "Create a project",
  description = "Add a new project to start receiving GuardFlow telemetry.",
  submitLabel = "Create project",
}: ProjectCreateFormProps) {
  const [name, setName] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) {
      setLocalError("Project name is required")
      return
    }

    try {
      setLocalError(null)
      await onCreate(trimmedName)
      setName("")
    } catch {
      // The parent surfaces the request error message.
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            htmlFor="project-name"
          >
            Project name
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Customer API"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </div>

        {(localError || error) && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
            {localError || error}
          </div>
        )}

        <Button className="w-full sm:w-auto" disabled={loading} type="submit">
          <Plus className="h-4 w-4" />
          {loading ? "Creating..." : submitLabel}
        </Button>
      </form>
    </div>
  )
}
