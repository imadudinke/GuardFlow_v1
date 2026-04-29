import { useCallback, useEffect, useState } from "react"
import type { ThreatLog } from "@/generated/models/ThreatLog"
import { ThreatsAPI } from "@/lib/api/threats"

interface UseUserThreatsOptions {
  projectIds: string[]
  pollingInterval?: number
  limitPerProject?: number
}

interface UseUserThreatsReturn {
  threats: ThreatLog[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUserThreats({
  projectIds,
  pollingInterval = 10000,
  limitPerProject = 50,
}: UseUserThreatsOptions): UseUserThreatsReturn {
  const [threats, setThreats] = useState<ThreatLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchThreats = useCallback(async () => {
    if (projectIds.length === 0) {
      setThreats([])
      setError(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const threatGroups = await Promise.all(
        projectIds.map((projectId) =>
          ThreatsAPI.getThreatsForProject(projectId, limitPerProject, 0)
        )
      )

      const combinedThreats = threatGroups
        .flat()
        .sort(
          (left, right) =>
            new Date(right.created_at).getTime() -
            new Date(left.created_at).getTime()
        )

      setThreats(combinedThreats)
    } catch (err) {
      console.error("Failed to fetch user threats:", err)
      setError(
        err instanceof Error ? err.message : "Failed to fetch threat activity"
      )
    } finally {
      setLoading(false)
    }
  }, [limitPerProject, projectIds])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchThreats()
    }, 0)

    if (projectIds.length === 0) {
      return () => window.clearTimeout(timeoutId)
    }

    const interval = setInterval(fetchThreats, pollingInterval)
    return () => {
      window.clearTimeout(timeoutId)
      clearInterval(interval)
    }
  }, [fetchThreats, pollingInterval, projectIds.length])

  return {
    threats,
    loading,
    error,
    refetch: fetchThreats,
  }
}
