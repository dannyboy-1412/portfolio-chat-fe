'use client'

import { ArrowUpRight } from 'lucide-react'
import { track } from '@vercel/analytics'
import { useChat } from '@/app/components/ui/chat-provider'
import type { ChatContext } from '@/hooks/useChatThread'
import { cn } from '@/lib/utils'

export function AskDanielButton({
  context,
  label = 'Ask Daniel',
  className,
}: {
  context: ChatContext
  label?: string
  className?: string
}) {
  const { openChat } = useChat()

  const handleClick = () => {
    track('contextual_chat_started', { contextType: context.type, contextId: context.id })
    openChat({ context })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex h-11 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-surface-500 transition-colors hover:text-glow',
        className
      )}
    >
      {label}
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
    </button>
  )
}
