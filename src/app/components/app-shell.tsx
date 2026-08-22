'use client'

import type { ReactNode } from 'react'
import { ChatProvider } from '@/app/components/ui/chat-provider'
import { TerminalProvider } from '@/app/components/terminal/terminal-provider'
import { ThemeBackground } from '@/app/components/ui/theme-background'
import { Navbar } from '@/app/components/ui/navbar'
import { LazyOverlays } from '@/app/components/ui/lazy-overlays'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <TerminalProvider>
        <div className="relative min-h-screen bg-transparent text-surface-100">
          <ThemeBackground />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
          </div>
        </div>
        <LazyOverlays />
      </TerminalProvider>
    </ChatProvider>
  )
}
