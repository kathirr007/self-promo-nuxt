<script setup lang="ts">
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { all, createLowlight } from 'lowlight'
import { CustomDocument, SubtitleNode, TitleNode } from './extensions'

const props = defineProps<{
  initialContent: string
}>()

// Create lowlight instance with all languages
const lowlight = createLowlight(all)

const editor = useEditor({
  editable: false,
  extensions: [
    CustomDocument,
    TitleNode,
    SubtitleNode,
    StarterKit.configure({
      document: false,
      underline: false, // Disable underline from StarterKit
      codeBlock: false, // Disable default codeBlock to use CodeBlockLowlight instead
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
  ],
  content: props.initialContent || '',
})

watch(() => props.initialContent, (val) => {
  if (editor.value && val)
    editor.value.commands.setContent(val)
})

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
  <div class="editor editor-squished">
    <EditorContent class="editor__content" :editor="editor" />
  </div>
</template>
