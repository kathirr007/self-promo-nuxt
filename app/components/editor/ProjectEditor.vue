<script setup lang="ts">
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'

const props = defineProps<{
  initialContent: string
}>()

const emit = defineEmits<{
  editorUpdated: [content: string]
}>()

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      underline: false,
    }),
    Underline,
  ],
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
    <EditorProjectEditorMenu v-if="editor" :editor="editor" />
    <EditorContent class="editor__content" :editor="editor" data-lpignore="true" />
  </div>
</template>

<style lang="scss">
.project-editor {
  border: 1px solid gray;
  border-radius: 7px;

  .editor__content {
    padding: 0 20px 20px 20px;
  }

  .ProseMirror {
    p {
      font-size: 16px;
    }

    &:focus {
      outline: none;
    }
  }

  .menubar {
    border-radius: 7px 7px 0 0;
  }
}
</style>
