<script setup lang="ts">
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { all, createLowlight } from 'lowlight'
import { CustomDocument, SubtitleNode, TitleNode } from './extensions'

const props = withDefaults(defineProps<{
  isSaving?: boolean
}>(), {
  isSaving: false,
})

const emit = defineEmits<{
  editorMounted: [editor: TiptapEditor]
  editorUpdated: [{ content: string, title: string, subtitle: string }]
}>()

// Create lowlight instance with all languages
const lowlight = createLowlight(all)

const editor = useEditor({
  extensions: [
    CustomDocument,
    TitleNode,
    SubtitleNode,
    StarterKit.configure({
      codeBlock: false,
      document: false,
    }),
    BubbleMenuExtension,
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'title')
          return 'Your Title here..'
        if (node.type.name === 'subtitle')
          return 'Your Subtitle here..'
        return 'Write your experience story...'
      },
      showOnlyCurrent: false,
      emptyNodeClass: 'is-empty',
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
  ],
  onCreate: ({ editor: e }) => {
    // Don't initialize with default content - let it be set when content loads
    emit('editorMounted', e as TiptapEditor)
  },
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

function getNodeValueByName(name: string): string {
  if (!editor.value)
    return ''

  const docContent = editor.value.state.doc.content
  const nodes = docContent.content
  const node = nodes.find((n: any) => n.type.name === name)

  if (!node)
    return ''

  return node.textContent || ''
}

function sanitizeContent(htmlContent: string): string {
  if (!htmlContent)
    return ''

  // Parse and sanitize the HTML to ensure title and subtitle have proper classes
  const parser = typeof DOMParser !== 'undefined' ? new DOMParser() : null
  if (!parser)
    return htmlContent

  const doc = parser.parseFromString(htmlContent, 'text/html')

  // Ensure first h1 is title with class
  const firstH1 = doc.querySelector('h1')
  if (firstH1) {
    firstH1.className = 'title'
  }

  // Ensure first h2 is subtitle with class
  const firstH2 = doc.querySelector('h2')
  if (firstH2) {
    firstH2.className = 'subtitle'
  }

  return doc.body.innerHTML
}

function emitUpdate() {
  if (!editor.value)
    return

  const content = editor.value.getHTML()
  const title = getNodeValueByName('title')
  const subtitle = getNodeValueByName('subtitle')

  emit('editorUpdated', { content, title, subtitle })
}

function setEditorContent(htmlContent: string | undefined) {
  if (!editor.value || !htmlContent) {
    // Initialize with empty structure if no content
    console.log('Setting empty default content')
    editor.value?.commands.setContent({
      type: 'doc',
      content: [
        { type: 'title' },
        { type: 'subtitle' },
        { type: 'paragraph' },
      ],
    })
    return
  }

  const sanitized = sanitizeContent(htmlContent)
  editor.value.commands.setContent(sanitized)
}

defineExpose({
  setEditorContent,
  getNodeValueByName,
})
</script>

<template>
  <div class="editor editor-squished">
    <EditorBasicMenu v-if="editor" :editor="editor">
      <template #saveButton>
        <button
          :disabled="isSaving"
          class="button is-success button-save"
          @click="emitUpdate"
        >
          Save
        </button>
      </template>
    </EditorBasicMenu>
    <EditorBubbleMenu v-if="editor" :editor="editor" />
    <EditorContent class="editor__content" :editor="editor" />
  </div>
</template>

<style lang="scss" scoped>
.button-save {
  float: right;
  background-color: #23d160;

  &:hover {
    background-color: #2bc76c;
  }

  &:disabled {
    cursor: not-allowed;
  }
}
</style>
