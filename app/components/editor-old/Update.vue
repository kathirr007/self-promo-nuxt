<script setup lang="ts">
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'

withDefaults(defineProps<{ isSaving?: boolean }>(), { isSaving: false })

const emit = defineEmits<{
  editorMounted: [editor: ReturnType<typeof useEditor>]
  editorUpdated: [{ content: string, title: string, subtitle: string }]
}>()

const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Write your experience story...',
    }),
  ],
  onCreate: ({ editor: e }) => emit('editorMounted', e as any),
})

onBeforeUnmount(() => editor.value?.destroy())

function emitUpdate() {
  if (!editor.value)
    return
  const content = editor.value.getHTML()
  emit('editorUpdated', { content, title: '', subtitle: '' })
}
</script>