'use client'

import { track } from '@vercel/analytics'
import { Button } from '@/app/components/ui/button'
import { useChat } from '@/app/components/ui/chat-provider'

export function HeroActions() {
  const { openChat } = useChat()

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }

  const startConversation = () => {
    track('chat_started', { source: 'hero' })
    openChat({ context: null })
  }

  return (
    <div className="fade-up-delay-2 mt-8 flex flex-wrap items-center justify-center gap-3">
      <Button
        type="button"
        onClick={scrollToWork}
        className="h-11 rounded-lg bg-surface-100 px-5 text-sm font-medium text-surface-950 hover:bg-surface-200"
      >
        Explore my work
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={startConversation}
        className="h-11 rounded-lg border-glow/40 bg-transparent px-5 text-sm font-medium text-glow hover:bg-glow/10"
      >
        Start a conversation
      </Button>
    </div>
  )
}
