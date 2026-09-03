'use client'

import dynamic from 'next/dynamic'
import { useChat } from '@/app/components/ui/chat-provider'

const FullscreenTerminal = dynamic(
  () => import('@/app/components/terminal/fullscreen-terminal'),
  { ssr: false }
)

export function LazyOverlays() {
  const { isOpen } = useChat()

  return isOpen ? <FullscreenTerminal /> : null
}
