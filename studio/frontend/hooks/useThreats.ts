import { useEffect, useState, useCallback } from 'react';
import { ThreatsAPI, type PaginatedThreatsResponse } from '@/lib/api/threats';
import type { ThreatLog } from '@/generated/models/ThreatLog';

interface UseThreatsOptions {
  projectId: string | null;
  limit?: number;
  skip?: number;
  pollingInterval?: number; // in milliseconds
}

interface UseThreatsReturn {
  threats: ThreatLog[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useThreats({
  projectId,
  limit = 20,
  skip = 0,
  pollingInterval = 5000,
}: UseThreatsOptions): UseThreatsReturn {
  const [threats, setThreats] = useState<ThreatLog[]>([]);
  const [pagination, setPagination] = useState<UseThreatsReturn['pagination']>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const fetchThreats = useCallback(async () => {
    if (!projectId) {
      setThreats([]);
      setPagination(null);
      setLoading(false);
      setRefreshing(false);
      setError(null);
      setHasLoadedOnce(false);
      return;
    }

    const isInitialLoad = !hasLoadedOnce;

    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);
      const response = await ThreatsAPI.getThreatsForProject(projectId, limit, skip);

      // Handle both old array format and new paginated format
      if (Array.isArray(response)) {
        setThreats(response);
        setPagination({
          total: response.length,
          page: 1,
          pageSize: response.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        });
      } else {
        const data = response as PaginatedThreatsResponse;
        setThreats(data.threats);
        setPagination({
          total: data.total,
          page: data.page,
          pageSize: data.page_size,
          totalPages: data.total_pages,
          hasNext: data.has_next,
          hasPrev: data.has_prev,
        });
      }
      setHasLoadedOnce(true);
    } catch (err) {
      console.error('Failed to fetch threats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch threats');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [projectId, limit, skip, hasLoadedOnce]);

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
    pagination,
    loading,
    refreshing,
    error,
    refetch: fetchThreats,
  };
}
