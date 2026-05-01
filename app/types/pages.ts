/**
 * Page Types
 */

export const PageCommands = {
  DELETE_EXPERIENCE: 'DELETE_EXPERIENCE',
  EDIT_EXPERIENCE: 'EDIT_EXPERIENCE',
  DELETE_DRAFT: 'DELETE_DRAFT',
  EDIT_DRAFT: 'EDIT_DRAFT',
  TOGGLE_FEATURE: 'TOGGLE_FEATURE',
} as const

export type Command = typeof PageCommands[keyof typeof PageCommands]

export interface DropdownOption {
  name: string
  command: Command
}
