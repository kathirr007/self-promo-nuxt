<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

defineProps<{ editor: Editor | null }>()
</script>

<template>
  <div v-if="editor" class="menubar">
    <button
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('bold') }"
      @click.prevent="editor.chain().focus().toggleBold().run()"
    >
      <span class="sr-only">bold</span>
      <SharedIcon name="bold" size="small" />
    </button>
    <button
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('italic') }"
      @click.prevent="editor.chain().focus().toggleItalic().run()"
    >
      <span class="sr-only">italic</span>
      <SharedIcon name="italic" size="small" />
    </button>
    <button
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('strike') }"
      @click.prevent="editor.chain().focus().toggleStrike().run()"
    >
      <span class="sr-only">strikethrough</span>
      <SharedIcon name="strikethrough" size="small" />
    </button>
    <button
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('underline') }"
      @click.prevent="editor.chain().focus().toggleUnderline().run()"
    >
      <span class="sr-only">underline</span>
      <SharedIcon name="underline" size="small" />
    </button>
    <button
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('bulletList') }"
      @click.prevent="editor.chain().focus().toggleBulletList().run()"
    >
      <span class="sr-only">list-ul</span>
      <SharedIcon name="list-ul" />
    </button>
    <button
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('orderedList') }"
      @click.prevent="editor.chain().focus().toggleOrderedList().run()"
    >
      <span class="sr-only">list</span>
      <SharedIcon name="list-ol" />
    </button>
    <button class="menubar__button" @click.prevent="editor.chain().focus().undo().run()">
      <span class="sr-only">undo</span>
      <SharedIcon name="undo-alt" />
    </button>
    <button class="menubar__button" @click.prevent="editor.chain().focus().redo().run()">
      <span class="sr-only">redo</span>
      <SharedIcon name="redo" />
    </button>
  </div>
</template>
