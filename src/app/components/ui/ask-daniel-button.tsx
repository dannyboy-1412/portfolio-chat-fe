'use client'

import { ArrowUpRight } from 'lucide-react'
import { track } from '@vercel/analytics'
import { Button, type ButtonProps } from '@/app/components/ui/button'
import { useChat } from '@/app/components/ui/chat-provider'
import type { ChatContext } from '@/hooks/useChatThread'
import { cn } from '@/lib/utils'

export function AskDanielButton({
  context,
  label = 'Ask Daniel',
  className,
  variant = 'outline',
  size = 'sm',
}: {
  context: ChatContext
  label?: string
  className?: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
}) {
  const { openChat } = useChat()

  const handleClick = () => {
    track('contextual_chat_started', { contextType: context.type, contextId: context.id })
    openChat({ context })
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        'h-9 gap-1.5 rounded-lg border-surface-700 bg-transparent text-xs text-surface-300 hover:bg-surface-800 hover:text-surface-100',
        className
      )}
    >
      {label}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </Button>
  )
}
