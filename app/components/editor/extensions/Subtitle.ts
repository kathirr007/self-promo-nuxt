import { Node } from '@tiptap/core'

export const SubtitleNode = Node.create({
  name: 'subtitle',
  content: 'inline*',
  defining: true,
  parseHTML() {
    return [
      { tag: 'h2.subtitle' },
      { tag: 'h2[class~="subtitle"]' },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['h2', { class: 'subtitle', ...HTMLAttributes }, 0]
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        return false
      }
    }
  },
})
