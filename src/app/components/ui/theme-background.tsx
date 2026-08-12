'use client'

import { DiscoBackground } from '@/app/components/ui/backgrounds/disco-background'
import { RainBackground } from '@/app/components/ui/backgrounds/rain-background'
import { RetroBackground } from '@/app/components/ui/backgrounds/retro-background'

function DefaultBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 bg-surface-950" aria-hidden>
      <div className="absolute inset-0 ambient-glow" />
    </div>
  )
}

export function ThemeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="theme-bg theme-bg-default">
        <DefaultBackground />
      </div>
      <div className="theme-bg theme-bg-blurryface">
        <DiscoBackground />
      </div>
      <div className="theme-bg theme-bg-ok-computer">
        <RainBackground />
      </div>
      <div className="theme-bg theme-bg-blue-album">
        <RetroBackground />
      </div>
    </div>
  )
}
