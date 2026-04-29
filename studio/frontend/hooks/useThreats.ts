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
  const [error, setError] = useState<string | null>(null);

  const fetchThreats = useCallback(async () => {
    if (!projectId) {
      setThreats([]);
      setPagination(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching threats with params:', { projectId, limit, skip });
      const response = await ThreatsAPI.getThreatsForProject(projectId, limit, skip);
      console.log('Received threats response:', response);
      
      // Handle both old array format and new paginated format
      if (Array.isArray(response)) {
        // Old format - just an array of threats
        console.log('Received old format (array)');
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
        // New paginated format
        console.log('Received new paginated format');
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
    pagination,
    loading,
    error,
    refetch: fetchThreats,
  };
}
