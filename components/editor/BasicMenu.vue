<template>
  <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
    <div class="menubar">
      <button
        class="menubar__button"
        :class="{ 'is-active': isActive.bullet_list() }"
        @click="commands.bullet_list"
      >
        <span class="sr-only">list-ul</span>
        <icon name="list-ul" />
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': isActive.ordered_list() }"
        @click="commands.ordered_list"
      >
        <span class="sr-only">list-ol</span>
        <icon name="list-ol" />
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': isActive.blockquote() }"
        @click="commands.blockquote"
      >
        <span class="sr-only">quote-right</span>
        <icon name="quote-right" />
      </button>
      <button
        class="menubar__button"
        :class="{ 'is-active': isActive.code_block() }"
        @click="commands.code_block"
      >
        <span class="sr-only">file-code</span>
        <icon name="file-code" />
      </button>
      <button class="menubar__button" @click="commands.horizontal_rule">
        <span class="sr-only">ruler-horizontal</span>
        <icon name="ruler-horizontal" />
      </button>
      <button class="menubar__button" @click="commands.undo">
        <span class="sr-only">undo-alt</span>
        <icon name="undo-alt" />
      </button>
      <button class="menubar__button" @click="commands.redo">
        <span class="sr-only">redo</span>
        <icon name="redo" />
      </button>
      <slot name="saveButton"></slot>
    </div>
  </editor-menu-bar>
</template>
<script>
import { EditorMenuBar } from "tiptap";
import Icon from "~/components/shared/icon";
export default {
  components: {
    EditorMenuBar,
    Icon
  },
  props: {
    editor: Object
  }
};
</script>
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
