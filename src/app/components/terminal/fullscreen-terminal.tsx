'use client'

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Mail, RotateCcw } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { track } from '@vercel/analytics'
import { ScrollArea } from '@/app/components/ui/scroll'
import { useChat } from '@/app/components/ui/chat-provider'
import {
  CHAT_SUGGESTIONS,
  getExperienceById,
  getExperienceSuggestions,
  PROFILE,
} from '@/shared/profile'
import { getProjectBySlug, getProjectSuggestions } from '@/shared/projects'
import { extractContactCta, isContactIntent } from '@/lib/contactCta'
import { extractSourceLinks, type SourceLink } from '@/lib/sourceLinks'

const WELCOME_LINES = [
  "Welcome to Daniel's portfolio terminal.",
  'Ask about his work.',
]

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-1 last:mb-0">{children}</p>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mb-2 text-base font-semibold text-surface-100">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mb-2 text-sm font-semibold text-surface-100">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mb-1 text-sm font-semibold text-surface-100">{children}</h3>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-2 ml-4 list-disc">{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="mb-0.5">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mb-2 border-l-2 border-surface-600 pl-3 text-surface-400">
      {children}
    </blockquote>
  ),
}

export default function FullscreenTerminal() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    retry,
    clearChat,
    inputRef,
    scrollContainerRef,
    isOpen,
    closeChat,
    context,
  } = useChat()

  useEffect(() => {
    if (!isOpen) return
    requestAnimationFrame(() => inputRef.current?.focus())
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeChat()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeChat, inputRef])

  const suggestions = useMemo(() => {
    if (context?.type === 'project') {
      const project = getProjectBySlug(context.id)
      if (project) return getProjectSuggestions(project)
    }
    if (context?.type === 'experience') {
      const experience = getExperienceById(context.id)
      if (experience) return getExperienceSuggestions(experience)
    }
    return [...CHAT_SUGGESTIONS]
  }, [context])

  const hasMessages = messages.length > 0

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    track('chat_suggested_prompt', { prompt: suggestion })
    void sendMessage(suggestion)
  }

  return (
    <>
      <div
        aria-hidden
        onClick={closeChat}
        className="fixed inset-0 z-[65] bg-surface-950/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Daniel's AI assistant"
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="pointer-events-auto flex h-[min(40rem,calc(100%-2rem))] w-[min(56rem,calc(100%-2rem))] flex-col overflow-hidden border border-surface-800 bg-surface-950 shadow-2xl">
          <header className="flex items-center justify-between border-b border-surface-800 px-4 py-3 sm:px-6">
            <div>
              <p className="font-mono text-xs text-surface-400">daniel@portfolio</p>
              {context && (
                <p className="mt-0.5 font-mono text-[11px] text-surface-500">
                  context: {context.type}/{context.id}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                aria-label="Clear conversation"
                title="Clear conversation (Ctrl/Cmd+K)"
                className="flex h-11 items-center rounded-md px-3 font-mono text-xs text-surface-300 transition-colors hover:bg-surface-800 hover:text-surface-100"
              >
                [ CLEAR ]
              </button>
              <button
                type="button"
                onClick={closeChat}
                aria-label="Close terminal"
                className="flex h-11 items-center rounded-md px-3 font-mono text-xs text-surface-300 transition-colors hover:bg-surface-800 hover:text-surface-100"
              >
                [ EXIT ]
              </button>
            </div>
          </header>

          <ScrollArea
            ref={scrollContainerRef}
            role="log"
            aria-live="polite"
            aria-label="Assistant transcript"
            onClick={() => inputRef.current?.focus()}
            className="terminal-noise flex-1 px-4 py-3 font-mono text-sm sm:px-6"
          >
            {!hasMessages && (
              <div className="mb-3 space-y-1 text-surface-400">
                {WELCOME_LINES.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            )}

            {messages.map((message, index) => {
              const previous = messages[index - 1]
              const forceCta =
                message.role === 'assistant' &&
                previous?.role === 'user' &&
                isContactIntent(previous.content)

              return (
                <TranscriptTurn
                  key={message.id || `msg-${index}`}
                  role={message.role}
                  content={message.content}
                  forceCta={forceCta}
                  onNavigate={closeChat}
                />
              )
            })}

            {isLoading && isStreaming && (
              <p className="mb-3 text-surface-500" aria-label="Waiting for reply">
                <span className="terminal-cursor inline-block h-4 w-2 bg-glow align-middle" />
              </p>
            )}

            {error && (
              <div className="mb-3 text-sm text-red-400">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => void retry()}
                  className="mt-2 inline-flex h-11 items-center gap-1.5 font-mono text-xs text-glow hover:underline"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  retry
                </button>
              </div>
            )}

            <div className="flex items-start gap-2">
              <label htmlFor="assistant-terminal-input" className="sr-only">
                Message Daniel&apos;s assistant
              </label>
              <span className="shrink-0 pt-1.5 text-glow">daniel@portfolio:~$</span>
              <textarea
                id="assistant-terminal-input"
                ref={(node) => {
                  inputRef.current = node
                }}
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Ask about his work."
                disabled={isLoading}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="max-h-32 min-h-[2.25rem] min-w-0 flex-1 resize-none border-0 bg-transparent py-1.5 text-sm text-surface-100 placeholder:text-surface-600 focus:outline-none disabled:opacity-50"
              />
              <span className="terminal-cursor mt-2 h-4 w-2 shrink-0 bg-glow" aria-hidden />
            </div>
          </ScrollArea>

          {!hasMessages && (
            <div className="flex flex-wrap gap-2 border-t border-surface-800 px-4 py-3 sm:px-6">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex min-h-11 max-w-full items-center rounded-lg border border-surface-700 bg-surface-900/60 px-3 py-2 text-left font-mono text-xs text-surface-300 transition-colors hover:bg-surface-800 hover:text-surface-100"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function TranscriptTurn({
  role,
  content,
  forceCta = false,
  onNavigate,
}: {
  role: string
  content: string
  forceCta?: boolean
  onNavigate: () => void
}) {
  const isUser = role === 'user'
  const { text: withoutCta, showCta: ctaMarkerFound } = isUser
    ? { text: content, showCta: false }
    : extractContactCta(content)
  const { text, links } = isUser
    ? { text: withoutCta, links: [] as SourceLink[] }
    : extractSourceLinks(withoutCta)
  const showCta = Boolean(!isUser && (ctaMarkerFound || forceCta))

  if (isUser) {
    return (
      <div className="mb-3">
        <p className="whitespace-pre-wrap text-surface-200">
          <span className="text-glow">$</span> {text}
        </p>
      </div>
    )
  }

  if (!text && links.length === 0 && !showCta) {
    return null
  }

  return (
    <div className="mb-3 space-y-2 pl-4 text-surface-300">
      {text ? (
        <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {text}
        </Markdown>
      ) : null}
      {links.length > 0 ? <SourceLinks links={links} onNavigate={onNavigate} /> : null}
      {showCta ? <ContactCta /> : null}
    </div>
  )
}

function SourceLinks({
  links,
  onNavigate,
}: {
  links: SourceLink[]
  onNavigate: () => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => {
        const project = link.type === 'project' ? getProjectBySlug(link.id) : undefined
        const href = link.type === 'project' ? `/projects/${link.id}` : '/#experience'
        const label =
          link.type === 'project'
            ? (project?.name ?? `project/${link.id}`)
            : (getExperienceById(link.id)?.company ?? `experience/${link.id}`)
        return (
          <Link
            key={`${link.type}-${link.id}`}
            href={href}
            onClick={onNavigate}
            className="inline-flex h-11 items-center font-mono text-xs text-glow underline decoration-glow/40 underline-offset-4 transition-colors hover:decoration-glow"
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}

function ContactCta() {
  const email = PROFILE.socials.email
  const subject = encodeURIComponent('Enquiry from your website')
  const mailto = `mailto:${email}?subject=${subject}`
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}`

  return (
    <div>
      <p className="mb-2 text-xs text-surface-500">Want to reach Daniel?</p>
      <a
        href={mailto}
        onClick={(event) => {
          event.preventDefault()
          track('contact_clicked', { source: 'chat_cta' })
          const popup = window.open(gmailCompose, '_blank', 'noopener,noreferrer')
          if (!popup) {
            window.location.href = mailto
          }
        }}
        className="inline-flex h-11 items-center gap-2 font-mono text-xs text-glow underline decoration-glow/40 underline-offset-4 hover:decoration-glow"
      >
        <Mail className="h-3.5 w-3.5" />
        Email him
      </a>
    </div>
  )
}
