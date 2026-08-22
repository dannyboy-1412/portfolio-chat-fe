/**
 * Splits terminal input into tokens on whitespace, honoring double-quoted
 * substrings (e.g. `ask "what did you build at mesha"` is one token after `ask`).
 */
export function tokenize(input: string): string[] {
  const tokens: string[] = []
  let current = ''
  let inQuotes = false

  for (const char of input) {
    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (char === ' ' && !inQuotes) {
      if (current) {
        tokens.push(current)
        current = ''
      }
      continue
    }
    current += char
  }

  if (current) {
    tokens.push(current)
  }

  return tokens
}

export type ParsedCommand = {
  command: string
  args: string[]
  rawInput: string
}

export function parseCommand(input: string): ParsedCommand | null {
  const trimmed = input.trim()
  if (!trimmed) {
    return null
  }

  const [command, ...args] = tokenize(trimmed)
  if (!command) {
    return null
  }

  return { command: command.toLowerCase(), args, rawInput: trimmed }
}
