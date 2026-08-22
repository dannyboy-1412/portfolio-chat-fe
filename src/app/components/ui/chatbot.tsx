'use client'

import { useEffect } from 'react'
import { ArrowUp, Bot, Loader2, Mail } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { ScrollArea } from '@/app/components/ui/scroll'
import { useChat } from '@/app/components/ui/chat-provider'
import { CHAT_SUGGESTIONS, PROFILE } from '@/shared/profile'
import { extractContactCta, isContactIntent } from '@/lib/contactCta'
import { cn } from '@/lib/utils'

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-1 last:mb-0">{children}</p>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mb-2 text-2xl font-bold">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mb-2 text-xl font-bold">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mb-2 text-lg font-bold">{children}</h3>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-2 ml-6 list-disc">{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="mb-1">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mb-2 border-l-4 border-surface-600 pl-4">
      {children}
    </blockquote>
  ),
}

export function Chatbot() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isStreaming,
    sendMessage,
    inputRef,
    scrollContainerRef,
  } = useChat()

  useEffect(() => {
    inputRef.current?.focus()
  }, [inputRef])

  const hasMessages = messages.length > 0

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void sendMessage()
    }
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col overflow-hidden rounded-2xl border border-surface-800/80 bg-surface-900/60 shadow-2xl shadow-surface-950/40 backdrop-blur-sm',
        hasMessages ? 'h-[560px]' : 'min-h-[220px]'
      )}
    >
      {hasMessages ? (
        <>
          <ScrollArea
            ref={scrollContainerRef}
            className="flex-1 space-y-4 p-4"
          >
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
                <div className="rounded-2xl bg-surface-950/80 px-3.5 py-2.5 shadow-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-surface-400" />
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="border-t border-surface-800/80 bg-surface-900/80 p-3">
            <ChatInput
              inputRef={inputRef}
              value={inputMessage}
              onChange={setInputMessage}
              onKeyDown={onKeyDown}
              onSend={() => void sendMessage()}
              disabled={isLoading}
              placeholder="Ask a follow-up… (Ctrl/Cmd+K to clear)"
            />
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-8">
          <div className="flex flex-wrap justify-center gap-2">
            {CHAT_SUGGESTIONS.map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                className="h-auto max-w-full whitespace-normal rounded-full border-surface-700 bg-surface-900/50 px-3 py-1.5 text-left text-xs text-surface-300 hover:bg-surface-800 hover:text-surface-100"
                onClick={() => void sendMessage(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
          <div className="w-full max-w-xl">
            <ChatInput
              inputRef={inputRef}
              value={inputMessage}
              onChange={setInputMessage}
              onKeyDown={onKeyDown}
              onSend={() => void sendMessage()}
              disabled={isLoading}
              placeholder="Ask me anything about my experience…"
              pill
            />
          </div>
        </div>
      )}
    </div>
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
  const extracted = isUser ? null : extractContactCta(content)
  const text = isUser ? content : extracted?.text ?? ''
  const showCta = Boolean(extracted && (extracted.showCta || forceCta))

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="mr-2 mt-3 shrink-0 text-surface-500">
          <Bot size={18} />
        </div>
      )}
      <div
        className={cn(
          'flex max-w-[92%] flex-col',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        {text ? (
          <div
            className={cn(
              'inline-block rounded-2xl px-3.5 py-2.5 text-sm shadow-lg backdrop-blur-sm',
              isUser
                ? 'bg-surface-800 text-surface-100'
                : 'bg-surface-950/80 text-surface-300'
            )}
          >
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {text}
            </Markdown>
          </div>
        ) : null}
        {showCta ? <ChatContactCta spaced={Boolean(text)} /> : null}
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
        'rounded-2xl border border-surface-800/80 bg-surface-950/80 px-3.5 py-2.5 shadow-lg backdrop-blur-sm',
        spaced && 'mt-2'
      )}
    >
      <p className="mb-2 text-xs text-surface-400">Want to reach Daniel?</p>
      <a
        href={mailto}
        onClick={(event) => {
          event.preventDefault()
          const popup = window.open(gmailCompose, '_blank', 'noopener,noreferrer')
          if (!popup) {
            window.location.href = mailto
          }
        }}
        className="inline-flex h-8 items-center justify-center gap-2 rounded-full bg-glow px-3 text-xs font-medium text-surface-50 transition-colors hover:bg-glow/90"
      >
        <Mail className="h-3.5 w-3.5" />
        Email him
      </a>
    </div>
  )
}

function ChatInput({
  inputRef,
  value,
  onChange,
  onKeyDown,
  onSend,
  disabled,
  placeholder,
  pill = false,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onSend: () => void
  disabled: boolean
  placeholder: string
  pill?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 border border-surface-700/80 bg-surface-800/60 transition-colors focus-within:border-glow/50',
        pill ? 'rounded-full px-2 py-1.5 shadow-lg shadow-glow/5' : 'rounded-2xl px-2 py-1.5'
      )}
    >
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 border-0 bg-transparent text-sm text-surface-100 shadow-none placeholder:text-surface-500 focus-visible:ring-0"
      />
      <button
        type="button"
        onClick={onSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-glow text-surface-50 transition-opacity disabled:opacity-40"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  )
}
