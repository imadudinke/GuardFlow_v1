import '@/lib/api/config';
import { useCallback, useEffect, useState } from 'react';
import { ProjectsService } from '@/generated/services/ProjectsService';
import type { Project } from '@/generated/models/Project';
import { getApiUrl } from '@/lib/api/url';

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
  rotateApiKey: (projectId: string) => Promise<Project>;
  setHardBanEnabled: (projectId: string, enabled: boolean) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
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

  const rotateApiKey = async (projectId: string) => {
    const response = await fetch(getApiUrl(`/api/v1/projects/${projectId}/rotate-key`), {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || 'Failed to rotate API key');
    }

    const updatedProject = (await response.json()) as Project;
    setProjects((currentProjects) =>
      currentProjects.map((project) => (project.id === projectId ? updatedProject : project)),
    );
    return updatedProject;
  };

  const setHardBanEnabled = async (projectId: string, enabled: boolean) => {
    const response = await fetch(getApiUrl(`/api/v1/projects/${projectId}`), {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hard_ban_enabled: enabled }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || 'Failed to update project control');
    }

    const updatedProject = (await response.json()) as Project;
    setProjects((currentProjects) =>
      currentProjects.map((project) => (project.id === projectId ? updatedProject : project)),
    );
    return updatedProject;
  };

  const deleteProject = async (projectId: string) => {
    try {
      const url = getApiUrl(`/api/v1/projects/${projectId}`);
      console.log('Attempting to delete project at URL:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || `Failed to delete project: ${response.status} ${response.statusText}`);
      }

      // Remove project from local state
      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== projectId)
      );
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
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
    rotateApiKey,
    setHardBanEnabled,
    deleteProject,
  };
}
