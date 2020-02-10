<template>
  <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
    <div class="menubar">
      <button
        class="menubar__button"
        :class="{ 'is-active': isActive.bold() }"
        @click="commands.bold()"
      >
        <icon name="bold" size="small" />
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': isActive.italic() }"
        @click="commands.italic()"
      >
        <icon name="italic" size="small" />
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': isActive.strike() }"
        @click="commands.strike()"
      >
        <icon name="strikethrough" size="small" />
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': isActive.underline() }"
        @click="commands.underline()"
      >
        <icon name="underline" size="small" />
      </button>
      <button class="menubar__button" :class="{ 'is-active': isActive.bullet_list() }" @click="commands.bullet_list">
        <icon name="list-ul" />
      </button>
      <button class="menubar__button" :class="{ 'is-active': isActive.ordered_list() }" @click="commands.ordered_list">
        <icon name="list-ol" />
      </button>
      <button class="menubar__button" @click="commands.undo">
        <icon name="undo-alt" />
      </button>
      <button class="menubar__button" @click="commands.redo">
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