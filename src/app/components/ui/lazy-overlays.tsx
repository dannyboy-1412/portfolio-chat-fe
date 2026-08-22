'use client'

import dynamic from 'next/dynamic'
import { useChat } from '@/app/components/ui/chat-provider'
import { useTerminal } from '@/app/components/terminal/terminal-provider'

const FullscreenTerminal = dynamic(
  () => import('@/app/components/terminal/fullscreen-terminal'),
  { ssr: false }
)
const ChatPanel = dynamic(
  () => import('@/app/components/ui/chat-panel').then((mod) => mod.ChatPanel),
  { ssr: false }
)

export function LazyOverlays() {
  const { isOpen: chatOpen } = useChat()
  const { isOpen: terminalOpen } = useTerminal()

  return (
    <>
      {terminalOpen ? <FullscreenTerminal /> : null}
      {chatOpen ? <ChatPanel /> : null}
    </>
  )
}
