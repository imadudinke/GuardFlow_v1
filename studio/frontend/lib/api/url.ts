const DEFAULT_API_ORIGIN = "http://localhost:8001"

export function getApiOrigin(): string {
  const configuredBase = process.env.NEXT_PUBLIC_API_URL?.trim()

  if (!configuredBase) {
    return DEFAULT_API_ORIGIN
  }

  return configuredBase.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "")
}

export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${getApiOrigin()}${normalizedPath}`
}
