'use client'

import { Terminal } from '@/app/components/terminal/terminal'
import { useTerminalActions } from '@/app/components/terminal/use-terminal-actions'

export function HeroTerminal() {
  const handleAction = useTerminalActions()

  return (
    <Terminal
      variant="inline"
      onAction={handleAction}
      autoFocus={false}
      placeholder="Type help or start-chat."
    />
  )
}
