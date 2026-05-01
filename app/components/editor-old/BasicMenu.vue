<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

defineProps<{ editor: Editor | null }>()
</script>

<template>
  <div v-if="editor" class="menubar">
    <button class="menubar__button" :class="{ 'is-active': editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()">
      <span class="sr-only">list-ul</span>
      <SharedIcon name="list-ul" />
    </button>
    <button class="menubar__button" :class="{ 'is-active': editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()">
      <span class="sr-only">list-ol</span>
      <SharedIcon name="list-ol" />
    </button>
    <button class="menubar__button" :class="{ 'is-active': editor.isActive('blockquote') }" @click="editor.chain().focus().toggleBlockquote().run()">
      <span class="sr-only">quote-right</span>
      <SharedIcon name="quote-right" />
    </button>
    <button class="menubar__button" :class="{ 'is-active': editor.isActive('codeBlock') }" @click="editor.chain().focus().toggleCodeBlock().run()">
      <span class="sr-only">file-code</span>
      <SharedIcon name="file-code" />
    </button>
    <button class="menubar__button" @click="editor.chain().focus().setHorizontalRule().run()">
      <span class="sr-only">ruler-horizontal</span>
      <SharedIcon name="ruler-horizontal" />
    </button>
    <button class="menubar__button" @click="editor.chain().focus().undo().run()">
      <span class="sr-only">undo-alt</span>
      <SharedIcon name="undo-alt" />
    </button>
    <button class="menubar__button" @click="editor.chain().focus().redo().run()">
      <span class="sr-only">redo</span>
      <SharedIcon name="redo" />
    </button>
    <slot name="saveButton" />
  </div>
</template>

<style scoped lang="scss">
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
