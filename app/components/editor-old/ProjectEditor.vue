<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'

const props = defineProps<{ initialContent: string }>()
const emit = defineEmits<{ editorUpdated: [content: string] }>()

const editor = useEditor({
  extensions: [StarterKit],
  content: props.initialContent || '',
  onUpdate: () => {
    emit('editorUpdated', editor.value?.getHTML() ?? '')
  },
})

watch(() => props.initialContent, (val) => {
  if (editor.value && val && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val)
  }
})

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
  <div class="editor project-editor">
    <EditorProjectEditorMenu :editor="editor ?? null" />
    <EditorContent class="editor__content" :editor="editor" data-lpignore="true" />
  </div>
</template>