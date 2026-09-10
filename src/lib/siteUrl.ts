const DEFAULT_SITE_URL = "https://dannyboy-1412.github.io"

export function getSiteUrl(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL
  if (typeof fromEnv === "string" && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, "")
  }
  return DEFAULT_SITE_URL
}
