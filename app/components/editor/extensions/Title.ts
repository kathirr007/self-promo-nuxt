import { Node } from '@tiptap/core'

export const TitleNode = Node.create({
  name: 'title',
  content: 'inline*',
  defining: true,
  parseHTML() {
    return [
      { tag: 'h1.title' },
      { tag: 'h1[class~="title"]' },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['h1', { class: 'title', ...HTMLAttributes }, 0]
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        return false
      }
    }
  },
})