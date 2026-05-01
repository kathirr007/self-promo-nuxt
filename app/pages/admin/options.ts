export const commands = {
  DELETE_EXPERIENCE: 'DELETE_EXPERIENCE',
  EDIT_EXPERIENCE: 'EDIT_EXPERIENCE',
  DELETE_DRAFT: 'DELETE_DRAFT',
  EDIT_DRAFT: 'EDIT_DRAFT',
  TOGGLE_FEATURE: 'TOGGLE_FEATURE',
} as const

export type Command = typeof commands[keyof typeof commands]

interface DropdownOption { name: string, command: Command }

const createOption = (name: string, command: Command): DropdownOption => ({ name, command })

const DELETE_EXPERIENCE = createOption('Delete Experience', commands.DELETE_EXPERIENCE)
const EDIT_EXPERIENCE = createOption('Edit Experience', commands.EDIT_EXPERIENCE)
const FEATURE_EXPERIENCE = createOption('Feature Experience', commands.TOGGLE_FEATURE)
const UN_FEATURE_EXPERIENCE = createOption('Un-Feature Experience', commands.TOGGLE_FEATURE)
const DELETE_DRAFT = createOption('Delete Draft', commands.DELETE_EXPERIENCE)
const EDIT_DRAFT = createOption('Edit Draft', commands.EDIT_EXPERIENCE)

export function createPublishedOptions(isFeatured: boolean): DropdownOption[] {
  const options = [EDIT_EXPERIENCE, DELETE_EXPERIENCE]
  isFeatured ? options.push(UN_FEATURE_EXPERIENCE) : options.push(FEATURE_EXPERIENCE)
  return options
}

export function createDraftsOptions(): DropdownOption[] {
  return [EDIT_DRAFT, DELETE_DRAFT]
}
