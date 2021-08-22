<template>
  <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
    <div class="menubar">
      <button
        class="menubar__button"
        :class="{ 'is-active': isActive.bold() }"
        @click.prevent="commands.bold()"
      >
      <span class="sr-only">bold</span>
        <icon name="bold" size="small" />
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': isActive.italic() }"
        @click.prevent="commands.italic()"
      >
      <span class="sr-only">italic</span>
        <icon name="italic" size="small" />
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': isActive.strike() }"
        @click.prevent="commands.strike()"
      >
      <span class="sr-only">strikethrough</span>
        <icon name="strikethrough" size="small" />
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': isActive.underline() }"
        @click.prevent="commands.underline()"
      >
      <span class="sr-only">underline</span>
        <icon name="underline" size="small" />
      </button>
      <button class="menubar__button" :class="{ 'is-active': isActive.bullet_list() }" @click.prevent="commands.bullet_list">
        <span class="sr-only">list-ul</span>
        <icon name="list-ul" />
      </button>
      <button class="menubar__button" :class="{ 'is-active': isActive.ordered_list() }" @click.prevent="commands.ordered_list">
        <span class="sr-only">list</span>
        <icon name="list-ol" />
      </button>
      <button class="menubar__button" @click.prevent="commands.undo">
        <span class="sr-only">undo</span>
        <icon name="undo-alt" />
      </button>
      <button class="menubar__button" @click.prevent="commands.redo">
        <span class="sr-only">redo</span>
        <icon name="redo" />
      </button>
    </div>
  </editor-menu-bar>
</template>
<script>
  import { EditorMenuBar } from 'tiptap'
  import Icon from '~/components/shared/icon'
  export default {
    components: {
      EditorMenuBar,
      Icon
    },
    props: {
      editor: Object
    }
  }
</script>
<style scoped lang="scss">
</style>