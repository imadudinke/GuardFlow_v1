"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { useAuth } from "@/contexts/AuthContext"

interface ProtectedDashboardPageProps {
  children: ReactNode
}

export function ProtectedDashboardPage({
  children,
}: ProtectedDashboardPageProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-zinc-900 dark:border-zinc-50"></div>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <DashboardShell>{children}</DashboardShell>
}
