"use client"

import { FormEvent, useState } from "react"
import { ProtectedDashboardPage } from "@/components/dashboard/protected-dashboard-page"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { getApiUrl } from "@/lib/api/url"

export default function SettingsPage() {
  const { user, checkAuth } = useAuth()
  const [emailDraft, setEmailDraft] = useState<string | null>(null)
  const [fullNameDraft, setFullNameDraft] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [profileMessage, setProfileMessage] = useState<string | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const email = emailDraft ?? user?.email ?? ""
  const fullName = fullNameDraft ?? user?.full_name ?? ""

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProfileMessage(null)
    setProfileLoading(true)

    try {
      const response = await fetch(getApiUrl("/api/v1/auth/me"), {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          full_name: fullName || null,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.detail || "Failed to update profile")
      }

      await checkAuth()
      setEmailDraft(null)
      setFullNameDraft(null)
      setProfileMessage("Profile updated.")
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordMessage(null)
    setPasswordLoading(true)

    try {
      const response = await fetch(getApiUrl("/api/v1/auth/change-password"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.detail || "Failed to update password")
      }

      setCurrentPassword("")
      setNewPassword("")
      setPasswordMessage("Password updated.")
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : "Failed to update password")
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <ProtectedDashboardPage>
      <div className="relative min-h-full overflow-hidden bg-white p-8 text-black">
        <div className="absolute inset-0 halftone-bg"></div>
        <div className="absolute inset-0 retro-grid"></div>
        
        <div className="relative z-10 space-y-8">
          <header className="retro-card-static p-6 bg-white">
            <div className="absolute inset-0 halftone-accent"></div>
            <div className="relative z-10">
              <p className="mb-2 inline-block retro-card-static bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-[0.35em] retro-mono">
                Account Deck
              </p>
              <h1 className="text-4xl font-black uppercase tracking-[0.08em] text-black retro-title sm:text-5xl">
                Settings
              </h1>
              <p className="mt-3 max-w-2xl retro-mono text-sm text-gray-600">
                Manage your profile, rotate credentials on your own account, and track which plan is
                powering this workspace.
              </p>
            </div>
          </header>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="retro-card-static bg-white p-6">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-black uppercase tracking-[0.08em] retro-title">Profile</h3>
                <p className="mt-2 text-sm text-gray-600 retro-mono">
                  Update the identity attached to this GuardFlow workspace.
                </p>

                <form className="mt-6 space-y-4" onSubmit={handleProfileSubmit}>
                  <div>
                    <label className="mb-2 block text-sm font-black uppercase tracking-[0.16em] retro-mono text-gray-700" htmlFor="full-name">
                      Full Name
                    </label>
                    <input
                      id="full-name"
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullNameDraft(event.target.value)}
                      className="w-full retro-card-static bg-white px-4 py-3 retro-mono outline-none focus:bg-gray-50"
                      placeholder="Operator Name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-black uppercase tracking-[0.16em] retro-mono text-gray-700" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmailDraft(event.target.value)}
                      className="w-full retro-card-static bg-white px-4 py-3 retro-mono outline-none focus:bg-gray-50"
                      placeholder="you@example.com"
                    />
                  </div>
                  {profileMessage && (
                    <div className="retro-card-static bg-red-100 px-4 py-3 text-sm font-semibold text-red-800 retro-mono">
                      {profileMessage}
                    </div>
                  )}
                  <Button type="submit" disabled={profileLoading} className="retro-button">
                    {profileLoading ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </div>
            </div>

            <div className="retro-card-static bg-white p-6 text-black">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-[0.08em] retro-title">Password</h3>
                <p className="mt-2 text-sm text-gray-600 retro-mono">
                  Change your account password without leaving the control room.
                </p>

                <form className="mt-6 space-y-4" onSubmit={handlePasswordSubmit}>
                  <div>
                    <label className="mb-2 block text-sm font-black uppercase tracking-[0.16em] retro-mono text-gray-700" htmlFor="current-password">
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      className="w-full retro-card-static bg-white px-4 py-3 retro-mono outline-none focus:bg-gray-50"
                      placeholder="Current password"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-black uppercase tracking-[0.16em] retro-mono text-gray-700" htmlFor="new-password">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className="w-full retro-card-static bg-white px-4 py-3 retro-mono outline-none focus:bg-gray-50"
                      placeholder="Minimum 8 characters"
                    />
                  </div>
                  {passwordMessage && (
                    <div className="retro-card-static bg-red-100 px-4 py-3 text-sm font-semibold text-red-800 retro-mono">
                      {passwordMessage}
                    </div>
                  )}
                  <Button type="submit" disabled={passwordLoading} className="retro-button">
                    {passwordLoading ? "Updating..." : "Change Password"}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="retro-card-static bg-white p-6 text-black">
              <div className="absolute inset-0 halftone-subtle"></div>
              <div className="relative z-10">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 retro-mono">Plan</p>
                <h3 className="mt-2 text-3xl font-black uppercase tracking-[0.08em] retro-title">
                  {user?.plan_tier || "Free"}
                </h3>
                <p className="mt-3 text-sm text-gray-600 retro-mono">
                  This is the current account plan attached to your workspace. Upgrade logic can now
                  build on a real stored plan tier instead of a placeholder.
                </p>
              </div>
            </div>

            <div className="retro-card-static bg-gray-900 p-6 text-white">
              <div className="absolute inset-0 halftone-accent"></div>
              <div className="relative z-10">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 retro-mono">Workspace Snapshot</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="retro-card-static bg-white p-4 text-black">
                    <div className="text-[10px] font-black uppercase tracking-[0.24em] retro-mono text-gray-600">Operator</div>
                    <div className="mt-2 text-lg font-black uppercase retro-title">{user?.full_name || "Unnamed"}</div>
                  </div>
                  <div className="retro-card-static bg-white p-4 text-black">
                    <div className="text-[10px] font-black uppercase tracking-[0.24em] retro-mono text-gray-600">Email</div>
                    <div className="mt-2 break-all retro-mono text-sm font-bold">{user?.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </ProtectedDashboardPage>
  )
}
