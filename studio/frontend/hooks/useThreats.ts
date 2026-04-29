import { useEffect, useState, useCallback } from 'react';
import { ThreatsAPI } from '@/lib/api/threats';
import type { ThreatLog } from '@/generated/models/ThreatLog';

interface UseThreatsOptions {
  projectId: string | null;
  limit?: number;
  skip?: number;
  pollingInterval?: number; // in milliseconds
}

interface UseThreatsReturn {
  threats: ThreatLog[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useThreats({
  projectId,
  limit = 100,
  skip = 0,
  pollingInterval = 5000,
}: UseThreatsOptions): UseThreatsReturn {
  const [threats, setThreats] = useState<ThreatLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThreats = useCallback(async () => {
    if (!projectId) {
      setThreats([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await ThreatsAPI.getThreatsForProject(projectId, limit, skip);
      setThreats(data);
    } catch (err) {
      console.error('Failed to fetch threats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch threats');
    } finally {
      setLoading(false);
    }
  }, [projectId, limit, skip]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchThreats();
    }, 0);

    // Set up polling
    const interval = setInterval(fetchThreats, pollingInterval);

    return () => {
      window.clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [fetchThreats, pollingInterval]);

  return {
    threats,
    loading,
    error,
    refetch: fetchThreats,
  };
}
