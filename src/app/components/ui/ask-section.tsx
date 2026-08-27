'use client'

import { ArrowRight } from 'lucide-react'
import { track } from '@vercel/analytics'
import { useChat } from '@/app/components/ui/chat-provider'

export function AskSection() {
  const { openChat } = useChat()

  const handleClick = () => {
    track('chat_started', { source: 'ask-section' })
    openChat({ context: null })
  }

  return (
    <section id="ask" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-surface-500">
          Curious about my work?
        </p>
        <p className="mt-4 max-w-xl font-display text-3xl leading-snug tracking-tight text-surface-50 sm:text-4xl">
          Ask my assistant about projects, experience or technical decisions.
        </p>
        <button
          type="button"
          onClick={handleClick}
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-surface-700 px-6 text-sm text-surface-100 transition-colors hover:border-glow/60 hover:text-glow"
        >
          Ask about my work
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </section>
  )
}
