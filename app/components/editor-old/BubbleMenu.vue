<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/extension-bubble-menu'

defineProps<{ editor: Editor | null }>()
</script>

<template>
  <BubbleMenu v-if="editor" :editor="editor">
    <div class="menububble is-active">
      <button class="menububble__button" :class="{ 'is-active': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
        <span class="sr-only">bold</span>
        <SharedIcon name="bold" size="small" />
      </button>
      <button class="menububble__button" :class="{ 'is-active': editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
        <span class="sr-only">italic</span>
        <SharedIcon name="italic" size="small" />
      </button>
      <button class="menububble__button" :class="{ 'is-active': editor.isActive('code') }" @click="editor.chain().focus().toggleCode().run()">
        <span class="sr-only">code</span>
        <SharedIcon name="code" size="small" />
      </button>
      <button class="menububble__button" :class="{ 'is-active': editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()">
        <span class="sr-only">strikethrough</span>
        <SharedIcon name="strikethrough" size="small" />
      </button>
      <button class="menububble__button" :class="{ 'is-active': editor.isActive('underline') }" @click="editor.chain().focus().toggleUnderline().run()">
        <span class="sr-only">underline</span>
        <SharedIcon name="underline" size="small" />
      </button>
      <button class="menububble__button" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
        H1
      </button>
      <button class="menububble__button" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
        H2
      </button>
      <button class="menububble__button" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
        H3
      </button>
      <button class="menububble__button" :class="{ 'is-active': editor.isActive('paragraph') }" @click="editor.chain().focus().setParagraph().run()">
        <span class="sr-only">paragraph</span>
        <SharedIcon name="paragraph" size="small" />
      </button>
    </div>
  </BubbleMenu>
</template>
