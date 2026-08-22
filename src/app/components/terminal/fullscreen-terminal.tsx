'use client'

import { useEffect } from 'react'
import { track } from '@vercel/analytics'
import { Terminal } from '@/app/components/terminal/terminal'
import { useTerminal } from '@/app/components/terminal/terminal-provider'
import { useTerminalActions } from '@/app/components/terminal/use-terminal-actions'
import { cn } from '@/lib/utils'

export default function FullscreenTerminal() {
  const { isOpen, close } = useTerminal()
  const handleAction = useTerminalActions(close)

  useEffect(() => {
    if (!isOpen) return
    track('terminal_open')

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  return (
    <div
      aria-hidden={!isOpen}
      className={cn(
        'fixed inset-0 z-[70] flex flex-col bg-surface-950 transition-opacity duration-300',
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      {isOpen && (
        <Terminal
          variant="fullscreen"
          onAction={handleAction}
          onExit={close}
          showWelcome
          placeholder='Type "help" to get started.'
        />
      )}
    </div>
  )
}
