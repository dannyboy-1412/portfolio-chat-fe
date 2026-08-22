import './commands'
import { getCommand, listVisibleCommands } from './registry'
import { parseCommand } from './tokenizer'
import { unknownCommandResult } from './commands'
import type { CommandResult } from './types'

export * from './types'
export { listVisibleCommands, getCommand }
export { tokenize, parseCommand } from './tokenizer'

export const WELCOME_LINES = [
  "Welcome to Daniel's portfolio terminal.",
  'Type `help` to get started.',
]

/**
 * Terminal architecture: tokenizer → parser → command registry → handler → output.
 * This is the single entry point the UI calls for both the hero strip and the
 * full-screen terminal.
 */
export function executeCommand(input: string): CommandResult | null {
  const parsed = parseCommand(input)
  if (!parsed) {
    return null
  }

  const command = getCommand(parsed.command)
  if (!command) {
    return unknownCommandResult(parsed.command)
  }

  return command.handler({
    command: parsed.command,
    args: parsed.args,
    rawInput: parsed.rawInput,
  })
}

export function commandNames(): string[] {
  return listVisibleCommands().map((command) => command.name)
}
