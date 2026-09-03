'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useChat } from '@/app/components/ui/chat-provider'

const FullscreenTerminal = dynamic(
  () => import('@/app/components/terminal/fullscreen-terminal'),
  { ssr: false }
)

export function LazyOverlays() {
  const { isOpen } = useChat()

  useEffect(() => {
    const preload = () => {
      void import('@/app/components/terminal/fullscreen-terminal')
    }
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(preload, { timeout: 2000 })
      return () => cancelIdleCallback(id)
    }
    const timer = window.setTimeout(preload, 1)
    return () => window.clearTimeout(timer)
  }, [])

  return isOpen ? <FullscreenTerminal /> : null
}
