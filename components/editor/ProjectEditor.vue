<template>
  <div class="editor project-editor">
    <project-editor-menu :editor="editor" />
    <editor-content
      class="editor__content"
      :editor="editor"
      data-lpignore="true"
    />
  </div>
</template>

<script>
import { Editor, EditorContent } from "tiptap";
import ProjectEditorMenu from "~/components/editor/ProjectEditorMenu";
import {
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  History,
  OrderedList,
  BulletList,
  ListItem,
} from "tiptap-extensions";

export default {
  components: {
    EditorContent,
    ProjectEditorMenu,
  },
  props: {
    initialContent: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      editor: null,
    };
  },
  // This is called only on client (In Browser)
  mounted() {
    this.editor = new Editor({
      extensions: [
        new Heading({ levels: [1, 2, 3] }),
        new Bold(),
        new Strike(),
        new Underline(),
        new Italic(),
        new History(),
        new OrderedList(),
        new BulletList(),
        new ListItem(),
      ],
      onUpdate: () => {
        this.emitUpdate();
      },
    });

    this.initialContent && this.editor.setContent(this.initialContent);
  },
  beforeDestroy() {
    this.editor && this.editor.destroy();
  },
  methods: {
    emitUpdate() {
      const content = this.editor.getHTML();
      this.$emit("editorUpdated", content);
    },
  },
};
</script>

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