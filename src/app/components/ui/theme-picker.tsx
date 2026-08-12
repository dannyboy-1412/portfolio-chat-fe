'use client'

import { useCallback, useRef } from 'react'
import { useTheme } from '@/app/components/ui/theme-provider'
import { THEMES, type AlbumThemeId } from '@/shared/themes'
import { cn } from '@/lib/utils'

export function ThemePicker() {
  const { themeId, toggleAlbumTheme } = useTheme()
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedIndex = THEMES.findIndex((theme) => theme.id === themeId)

  const focusTheme = useCallback((index: number) => {
    const next = ((index % THEMES.length) + THEMES.length) % THEMES.length
    buttonRefs.current[next]?.focus()
  }, [])

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    id: AlbumThemeId
  ) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      focusTheme(index + 1)
      return
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      focusTheme(index - 1)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      focusTheme(0)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      focusTheme(THEMES.length - 1)
      return
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      toggleAlbumTheme(id)
    }
  }

  return (
    <div className="mt-12 border-t border-surface-900 pt-8">
      <h3 className="text-sm font-medium text-surface-300">Music I listen to</h3>
      <p className="mt-1 text-sm text-surface-500">
        Pick a record to dress the site — click again to clear and return to the
        default look.
      </p>

      <div
        role="group"
        aria-label="Portfolio album themes"
        className="mt-4 flex flex-wrap gap-3"
      >
        {THEMES.map((theme, index) => {
          const selected = themeId === theme.id
          const tabbable = selected || (selectedIndex === -1 && index === 0)
          return (
            <button
              key={theme.id}
              ref={(node) => {
                buttonRefs.current[index] = node
              }}
              type="button"
              aria-pressed={selected}
              tabIndex={tabbable ? 0 : -1}
              onClick={() => toggleAlbumTheme(theme.id)}
              onKeyDown={(event) => onKeyDown(event, index, theme.id)}
              className={cn(
                'min-w-[10.5rem] flex-1 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow sm:flex-none',
                selected
                  ? 'border-glow bg-glow/10'
                  : 'border-surface-800 bg-surface-900/40 hover:border-surface-700 hover:bg-surface-900/70'
              )}
            >
              <span className="block text-sm font-medium text-surface-100">
                {theme.artist}
              </span>
              <span className="mt-0.5 block text-xs text-surface-500">
                {theme.album}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
