'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import {
  commandNames,
  executeCommand,
  tokenize,
  WELCOME_LINES,
  type CommandResult,
  type TerminalAction,
  type TerminalSegment,
  type TerminalSegmentTone,
} from '@/lib/terminal'
import { cn } from '@/lib/utils'

export type TerminalHistoryEntry = {
  id: string
  input: string
  result: CommandResult | null
}

const QUICK_COMMANDS = ['start-chat', 'projects', 'experience', 'skills', 'help']

function toneClass(tone?: TerminalSegmentTone) {
  switch (tone) {
    case 'muted':
      return 'text-surface-500'
    case 'accent':
      return 'text-glow'
    case 'error':
      return 'text-red-400'
    default:
      return 'text-surface-300'
  }
}

function SegmentView({
  segment,
  onAction,
}: {
  segment: TerminalSegment
  onAction: (action: TerminalAction) => void
}) {
  if (segment.kind === 'blank') {
    return <div className="h-2" aria-hidden />
  }
  if (segment.kind === 'line') {
    return (
      <p className={cn('whitespace-pre-wrap leading-relaxed', toneClass(segment.tone))}>
        {segment.text}
      </p>
    )
  }
  if (segment.kind === 'command') {
    return (
      <div className="flex items-baseline gap-3 py-0.5">
        <button
          type="button"
          onClick={() => onAction({ type: 'run', command: segment.name })}
          className="w-28 shrink-0 text-left font-semibold text-glow transition-colors hover:underline hover:decoration-glow hover:underline-offset-4"
        >
          {segment.name}
        </button>
        <span className="text-surface-500">{segment.description}</span>
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={() => onAction(segment.action)}
      className="block py-0.5 text-left text-glow underline decoration-glow/40 underline-offset-4 transition-colors hover:decoration-glow"
    >
      {segment.label}
    </button>
  )
}

export function Terminal({
  variant,
  onAction,
  onExit,
  autoFocus = true,
  className,
  placeholder = 'Type help or start-chat.',
  showWelcome = false,
}: {
  variant: 'inline' | 'fullscreen'
  onAction: (action: TerminalAction) => void
  onExit?: () => void
  autoFocus?: boolean
  className?: string
  placeholder?: string
  showWelcome?: boolean
}) {
  const [entries, setEntries] = useState<TerminalHistoryEntry[]>([])
  const [input, setInput] = useState('')
  const [hasFocused, setHasFocused] = useState(false)
  const commandHistoryRef = useRef<string[]>([])
  const historyIndexRef = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [])

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim()
      if (!trimmed) return

      const result = executeCommand(trimmed)
      commandHistoryRef.current.push(trimmed)
      historyIndexRef.current = null
      track('terminal_command', { command: trimmed.split(' ')[0] ?? trimmed })

      if (result?.kind === 'clear') {
        setEntries([])
        return
      }

      setEntries((prev) => [...prev, { id: crypto.randomUUID(), input: trimmed, result }])
      requestAnimationFrame(scrollToBottom)

      if (result?.kind === 'action') {
        window.setTimeout(
          () => onAction(result.action),
          variant === 'fullscreen' ? 260 : 0
        )
      }
    },
    [onAction, scrollToBottom, variant]
  )

  const handleSegmentAction = useCallback(
    (action: TerminalAction) => {
      if (action.type === 'run') {
        runCommand(action.command)
        return
      }
      onAction(action)
    },
    [onAction, runCommand]
  )

  const onSubmit = () => {
    runCommand(input)
    setInput('')
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onSubmit()
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const hist = commandHistoryRef.current
      if (hist.length === 0) return
      const current = historyIndexRef.current
      const next = current === null ? hist.length - 1 : Math.max(0, current - 1)
      historyIndexRef.current = next
      setInput(hist[next] ?? '')
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const hist = commandHistoryRef.current
      const current = historyIndexRef.current
      if (current === null) return
      const next = current + 1
      if (next >= hist.length) {
        historyIndexRef.current = null
        setInput('')
        return
      }
      historyIndexRef.current = next
      setInput(hist[next] ?? '')
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      const [first] = tokenize(input)
      if (!first) return
      const matches = commandNames().filter((name) => name.startsWith(first.toLowerCase()))
      if (matches.length === 1) {
        setInput(`${matches[0]} `)
      }
    }
  }

  const showSuggestions = variant === 'fullscreen' || hasFocused

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden border border-surface-800 bg-surface-950/90 backdrop-blur-sm',
        variant === 'inline' ? 'rounded-2xl shadow-2xl shadow-surface-950/40' : 'h-full w-full',
        className
      )}
    >
      {variant === 'fullscreen' && (
        <div className="flex items-center justify-between border-b border-surface-800 px-4 py-3 sm:px-6">
          <span className="font-mono text-xs text-surface-400">daniel@portfolio</span>
          <button
            type="button"
            onClick={onExit}
            className="flex h-11 items-center rounded-md px-3 font-mono text-xs text-surface-300 transition-colors hover:bg-surface-800 hover:text-surface-100"
          >
            [ EXIT TERMINAL ]
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        onClick={() => inputRef.current?.focus()}
        className={cn(
          'terminal-noise overflow-y-auto px-4 py-3 font-mono text-sm sm:px-6',
          variant === 'fullscreen' ? 'flex-1' : 'max-h-64'
        )}
      >
        {showWelcome && entries.length === 0 && (
          <div className="mb-3 space-y-1 text-surface-400">
            {WELCOME_LINES.map((welcomeLine) => (
              <p key={welcomeLine}>{welcomeLine}</p>
            ))}
          </div>
        )}

        {entries.map((entry) => (
          <div key={entry.id} className="mb-3">
            <p className="text-surface-200">
              <span className="text-glow">$</span> {entry.input}
            </p>
            {entry.result && entry.result.kind !== 'clear' && (
              <div className="mt-1 space-y-0.5 pl-4">
                {entry.result.segments.map((segment, index) => (
                  <SegmentView key={index} segment={segment} onAction={handleSegmentAction} />
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex items-center gap-2">
          <label htmlFor={`terminal-input-${variant}`} className="sr-only">
            Terminal command input
          </label>
          <span className="shrink-0 text-glow">daniel@portfolio:~$</span>
          <input
            id={`terminal-input-${variant}`}
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setHasFocused(true)}
            placeholder={placeholder}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-w-0 flex-1 border-0 bg-transparent text-surface-100 placeholder:text-surface-600 focus:outline-none"
          />
          <span className="terminal-cursor h-4 w-2 shrink-0 bg-glow" aria-hidden />
        </div>
      </div>

      {showSuggestions && (
        <div className="flex flex-wrap gap-2 border-t border-surface-800 px-4 py-3 sm:px-6">
          {QUICK_COMMANDS.map((commandName) => (
            <button
              key={commandName}
              type="button"
              onClick={() => runCommand(commandName)}
              className="flex h-11 items-center rounded-lg border border-surface-700 bg-surface-900/60 px-3 font-mono text-xs text-surface-300 transition-colors hover:bg-surface-800 hover:text-surface-100"
            >
              {commandName}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
