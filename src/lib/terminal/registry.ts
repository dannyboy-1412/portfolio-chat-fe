import type { CommandDefinition } from './types'

const registry = new Map<string, CommandDefinition>()

/**
 * Extensible command registry. New commands (e.g. `github`, `linkedin`, `blog`)
 * register here without touching the parser or terminal UI.
 */
export function registerCommand(definition: CommandDefinition): void {
  registry.set(definition.name, definition)
}

export function getCommand(name: string): CommandDefinition | undefined {
  return registry.get(name)
}

export function listVisibleCommands(): CommandDefinition[] {
  return [...registry.values()].filter((command) => !command.hidden)
}

/** Test helper — clears all registered commands. */
export function resetRegistry(): void {
  registry.clear()
}
