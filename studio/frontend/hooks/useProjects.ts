import '@/lib/api/config';
import { useCallback, useEffect, useState } from 'react';
import { ProjectsService } from '@/generated/services/ProjectsService';
import type { Project } from '@/generated/models/Project';

interface UseProjectsOptions {
  userId: string | null;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  createError: string | null;
  refetch: () => Promise<void>;
  createProject: (name: string) => Promise<Project>;
}

export function useProjects({ userId }: UseProjectsOptions): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!userId) {
      setProjects([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await ProjectsService.readUserProjectsApiV1ProjectsUserUserIdGet(userId);
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createProject = async (name: string) => {
    if (!userId) {
      throw new Error('You must be logged in to create a project');
    }

    try {
      setCreating(true);
      setCreateError(null);

      const newProject = await ProjectsService.createProjectApiV1ProjectsPost({
        name,
        user_id: userId,
      });

      setProjects((currentProjects) => [newProject, ...currentProjects]);
      return newProject;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create project';
      setCreateError(message);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchProjects();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    creating,
    createError,
    refetch: fetchProjects,
    createProject,
  };
}
