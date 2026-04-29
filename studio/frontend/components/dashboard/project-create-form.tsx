"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCreateFormProps {
  onCreate: (name: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  title?: string;
  description?: string;
  submitLabel?: string;
}

export function ProjectCreateForm({
  onCreate,
  loading = false,
  error = null,
  title = "Create a project",
  description = "Add a new project to start receiving GuardFlow telemetry.",
  submitLabel = "Create project",
}: ProjectCreateFormProps) {
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setLocalError("Project name is required");
      return;
    }

    try {
      setLocalError(null);
      await onCreate(trimmedName);
      setName("");
    } catch {
      // The parent surfaces the request error message.
    }
  };

  return (
    <div className="retro-card-static bg-white p-6 text-black">
      <div className="absolute inset-0 halftone-subtle"></div>
      <div className="relative z-10">
        <div className="mb-4">
          <h3 className="text-lg font-black uppercase tracking-[0.08em] retro-title">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 retro-mono">{description}</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="text-sm font-black uppercase tracking-[0.16em] text-gray-800 retro-mono"
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
              className="w-full retro-card-static bg-white px-4 py-3 text-sm font-medium text-gray-900 retro-mono outline-none transition focus:bg-gray-50"
            />
          </div>

          {(localError || error) && (
            <div className="retro-card-static bg-red-100 px-3 py-2 text-sm font-semibold text-red-800 retro-mono">
              {localError || error}
            </div>
          )}

          <Button className="w-full sm:w-auto retro-button" disabled={loading} type="submit">
            <Plus className="h-4 w-4" />
            {loading ? "Creating..." : submitLabel}
          </Button>
        </form>
      </div>
    </div>
  );
}
