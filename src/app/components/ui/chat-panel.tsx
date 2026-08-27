'use client'

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Bot, Loader2, Mail, RotateCcw, Trash2, X } from 'lucide-react'
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
import { extractSourceLinks, PROJECT_ANCHOR_EVENT, type SourceLink } from '@/lib/sourceLinks'
import { cn } from '@/lib/utils'

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-1 last:mb-0">{children}</p>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mb-2 text-xl font-bold">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mb-2 text-lg font-bold">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mb-2 text-base font-bold">{children}</h3>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-2 ml-6 list-disc">{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="mb-1">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mb-2 border-l-4 border-surface-600 pl-4">{children}</blockquote>
  ),
}

export function ChatPanel() {
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
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen, inputRef])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeChat()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, closeChat])

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
        className={cn(
          'fixed inset-0 z-[65] bg-surface-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-label="Daniel's AI assistant"
        className={cn(
          'fixed inset-y-0 right-0 z-[70] flex w-full flex-col border-l border-surface-800 bg-surface-950 shadow-2xl transition-transform duration-300 ease-out sm:max-w-md',
          isOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
        )}
      >
        <header className="flex items-center justify-between border-b border-surface-800 px-4 py-3">
          <div>
            <p className="font-mono text-sm text-surface-100">
              DANIEL<span className="text-glow">.AI</span>{' '}
              <span className="text-glow">● ONLINE</span>
            </p>
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
              className="flex h-9 w-9 items-center justify-center rounded-md text-surface-400 transition-colors hover:bg-surface-800 hover:text-surface-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={closeChat}
              aria-label="Close chat"
              className="flex h-9 w-9 items-center justify-center rounded-md text-surface-400 transition-colors hover:bg-surface-800 hover:text-surface-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <ScrollArea
          ref={scrollContainerRef}
          className="flex-1 space-y-4 p-4"
          role="log"
          aria-live="polite"
        >
          {!hasMessages && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-surface-800/80 bg-surface-900/40 p-4 text-sm text-surface-400">
                <p>I&apos;m Daniel&apos;s AI assistant. I can answer questions about his:</p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>Experience</li>
                  <li>Projects</li>
                  <li>Technical background</li>
                  <li>Education</li>
                  <li>Interests</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="h-auto max-w-full whitespace-normal rounded-full border border-surface-700 bg-surface-900/50 px-3 py-1.5 text-left text-xs text-surface-300 transition-colors hover:bg-surface-800 hover:text-surface-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => {
            const previous = messages[index - 1]
            const forceCta =
              message.role === 'assistant' &&
              previous?.role === 'user' &&
              isContactIntent(previous.content)

            return (
              <ChatMessage
                key={message.id || `msg-${index}`}
                role={message.role}
                content={message.content}
                forceCta={forceCta}
              />
            )
          })}

          {isLoading && isStreaming && (
            <div className="flex justify-start">
              <div className="mr-2 mt-3 shrink-0 text-surface-500">
                <Bot size={18} />
              </div>
              <div className="rounded-2xl bg-surface-900/80 px-3.5 py-2.5 shadow-lg">
                <Loader2 className="h-4 w-4 animate-spin text-surface-400" />
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-900/50 bg-red-950/30 px-3.5 py-2.5 text-sm text-red-300">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => void retry()}
                className="mt-2 inline-flex h-9 items-center gap-1.5 text-xs font-medium text-glow hover:underline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-surface-800 bg-surface-950 p-3">
          <div className="flex items-end gap-2 rounded-2xl border border-surface-700/80 bg-surface-800/60 px-2 py-1.5 transition-colors focus-within:border-glow/50">
            <textarea
              ref={(node) => {
                inputRef.current = node
              }}
              value={inputMessage}
              onChange={(event) => setInputMessage(event.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Ask a follow-up… (Shift+Enter for newline)"
              disabled={isLoading}
              className="max-h-32 min-h-[2.25rem] flex-1 resize-none border-0 bg-transparent px-1.5 py-1.5 text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              aria-label="Send message"
              className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-glow text-surface-950 transition-opacity disabled:opacity-40"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M12 19V5M12 5L6 11M12 5L18 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChatMessage({
  role,
  content,
  forceCta = false,
}: {
  role: string
  content: string
  forceCta?: boolean
}) {
  const isUser = role === 'user'
  const { text: withoutCta, showCta: ctaMarkerFound } = isUser
    ? { text: content, showCta: false }
    : extractContactCta(content)
  const { text, links } = isUser
    ? { text: withoutCta, links: [] as SourceLink[] }
    : extractSourceLinks(withoutCta)
  const showCta = Boolean(!isUser && (ctaMarkerFound || forceCta))

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="mr-2 mt-3 shrink-0 text-surface-500">
          <Bot size={18} />
        </div>
      )}
      <div className={cn('flex max-w-[92%] flex-col', isUser ? 'items-end' : 'items-start')}>
        {text ? (
          <div
            className={cn(
              'inline-block rounded-2xl px-3.5 py-2.5 text-sm shadow-lg backdrop-blur-sm',
              isUser ? 'bg-surface-800 text-surface-100' : 'bg-surface-900/80 text-surface-300'
            )}
          >
            <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {text}
            </Markdown>
          </div>
        ) : null}
        {links.length > 0 ? <SourceLinks links={links} spaced={Boolean(text)} /> : null}
        {showCta ? <ChatContactCta spaced={Boolean(text) || links.length > 0} /> : null}
      </div>
    </div>
  )
}

function SourceLinks({ links, spaced }: { links: SourceLink[]; spaced: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-2xl border border-surface-800/80 bg-surface-900/60 px-3.5 py-2.5',
        spaced && 'mt-2'
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-wide text-surface-500">
        {links.length > 1 ? 'Related work' : 'Source'}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {links.map((link) => {
          const project =
            link.type === 'project' ? getProjectBySlug(link.id) : undefined
          const isWorkProject = Boolean(project && project.origin !== 'personal')
          const href =
            link.type === 'project'
              ? isWorkProject
                ? `/#project-${link.id}`
                : `/projects/${link.id}`
              : '/#experience'
          const label =
            link.type === 'project'
              ? (project?.name ?? `project/${link.id}`)
              : (getExperienceById(link.id)?.company ?? `experience/${link.id}`)
          return (
            <Link
              key={`${link.type}-${link.id}`}
              href={href}
              onClick={
                isWorkProject
                  ? () =>
                      window.dispatchEvent(
                        new CustomEvent(PROJECT_ANCHOR_EVENT, { detail: link.id })
                      )
                  : undefined
              }
              className="inline-flex h-8 items-center rounded-lg border border-surface-700 bg-surface-950/60 px-2.5 text-xs text-glow transition-colors hover:bg-surface-800"
            >
              {label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function ChatContactCta({ spaced }: { spaced: boolean }) {
  const email = PROFILE.socials.email
  const subject = encodeURIComponent('Enquiry from your website')
  const mailto = `mailto:${email}?subject=${subject}`
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}`

  return (
    <div
      className={cn(
        'rounded-2xl border border-surface-800/80 bg-surface-900/60 px-3.5 py-2.5 shadow-lg backdrop-blur-sm',
        spaced && 'mt-2'
      )}
    >
      <p className="mb-2 text-xs text-surface-400">Want to reach Daniel?</p>
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
        className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-glow px-3 text-xs font-medium text-surface-950 transition-colors hover:bg-glow/90"
      >
        <Mail className="h-3.5 w-3.5" />
        Email him
      </a>
    </div>
  )
}
