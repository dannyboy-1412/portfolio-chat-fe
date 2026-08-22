export type ChatContextRef = {
  type: 'project' | 'experience'
  id: string
}

export type TerminalAction =
  | { type: 'scroll'; targetId: string }
  | { type: 'navigate'; href: string }
  | { type: 'open-chat'; context?: ChatContextRef | null; prompt?: string }
  | { type: 'run'; command: string }

export type TerminalSegmentTone = 'default' | 'muted' | 'accent' | 'error'

export type TerminalSegment =
  | { kind: 'line'; text: string; tone?: TerminalSegmentTone }
  | { kind: 'link'; label: string; action: TerminalAction }
  | { kind: 'blank' }

export type CommandContext = {
  command: string
  args: string[]
  rawInput: string
}

export type CommandResult =
  | { kind: 'output'; segments: TerminalSegment[] }
  | { kind: 'clear' }
  | { kind: 'action'; action: TerminalAction; segments: TerminalSegment[] }

export type CommandHandler = (ctx: CommandContext) => CommandResult

export type CommandDefinition = {
  name: string
  summary: string
  handler: CommandHandler
  /** Excluded from `help` output (e.g. aliases). */
  hidden?: boolean
}
