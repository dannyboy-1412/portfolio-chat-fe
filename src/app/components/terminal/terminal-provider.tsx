'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type TerminalContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const TerminalContext = createContext<TerminalContextValue | null>(null)

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close])

  return <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>
}

export function useTerminal(): TerminalContextValue {
  const ctx = useContext(TerminalContext)
  if (!ctx) {
    throw new Error('useTerminal must be used within a TerminalProvider')
  }
  return ctx
}
