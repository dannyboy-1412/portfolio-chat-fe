'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
  isThemeId,
  type AlbumThemeId,
  type ThemeId,
} from '@/shared/themes'

type ThemeContextValue = {
  themeId: ThemeId
  setThemeId: (id: ThemeId) => void
  /** Select an album theme, or clear it if it is already active. */
  toggleAlbumTheme: (id: AlbumThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyThemeToDocument(themeId: ThemeId) {
  document.documentElement.dataset.theme = themeId
  document.documentElement.classList.add('dark')
}

function readStoredTheme(): ThemeId {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return isThemeId(stored) ? stored : DEFAULT_THEME_ID
}

function persistTheme(themeId: ThemeId) {
  applyThemeToDocument(themeId)
  if (themeId === DEFAULT_THEME_ID) {
    window.localStorage.removeItem(THEME_STORAGE_KEY)
  } else {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeId)
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(DEFAULT_THEME_ID)

  useEffect(() => {
    const initial = readStoredTheme()
    applyThemeToDocument(initial)
    const frame = window.requestAnimationFrame(() => {
      setThemeIdState(initial)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const setThemeId = useCallback((id: ThemeId) => {
    persistTheme(id)
    setThemeIdState(id)
  }, [])

  const toggleAlbumTheme = useCallback((id: AlbumThemeId) => {
    setThemeIdState((current) => {
      const next: ThemeId = current === id ? DEFAULT_THEME_ID : id
      persistTheme(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ themeId, setThemeId, toggleAlbumTheme }),
    [themeId, setThemeId, toggleAlbumTheme]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
