'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useChatThread, type UseChatThreadResult } from '@/hooks/useChatThread'

const ChatContext = createContext<UseChatThreadResult | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const thread = useChatThread()
  return <ChatContext.Provider value={thread}>{children}</ChatContext.Provider>
}

export function useChat(): UseChatThreadResult {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return ctx
}
