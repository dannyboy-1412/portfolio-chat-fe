'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import { useChat } from '@/app/components/ui/chat-provider'
import type { TerminalAction } from '@/lib/terminal'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Executes navigation/chat side effects produced by terminal commands.
 * Shared by the hero terminal strip and the full-screen terminal overlay.
 */
export function useTerminalActions(closeOverlay?: () => void) {
  const router = useRouter()
  const { openChat } = useChat()

  return useCallback(
    (action: TerminalAction) => {
      switch (action.type) {
        case 'scroll': {
          closeOverlay?.()
          requestAnimationFrame(() => {
            document.getElementById(action.targetId)?.scrollIntoView({
              behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            })
          })
          return
        }
        case 'navigate': {
          const isExternal = action.href.startsWith('http') || action.href.startsWith('/resume')
          closeOverlay?.()
          if (isExternal) {
            window.open(action.href, '_blank', 'noopener,noreferrer')
          } else {
            router.push(action.href)
          }
          return
        }
        case 'open-chat': {
          closeOverlay?.()
          if (action.context) {
            track('contextual_chat_started', {
              contextType: action.context.type,
              contextId: action.context.id,
              source: 'terminal',
            })
          } else {
            track('chat_started', { source: 'terminal' })
          }
          openChat({ context: action.context ?? null, prompt: action.prompt })
          return
        }
        case 'run':
          return
        case 'exit':
          closeOverlay?.()
          return
        default:
          return
      }
    },
    [closeOverlay, openChat, router]
  )
}
